import type { LlmAdapter, StoryContext } from "./types.js";

export type Classification = "bold" | "cautious" | "curious" | "neutral";

const BOLD_WORDS = ["open", "go", "confront", "grab", "push", "fight", "charge", "walk toward", "walk in", "run toward"];
const CAUTIOUS_WORDS = ["wait", "hide", "quiet", "slow", "careful", "listen", "stay still", "back away", "close the laptop", "turn off", "lock"];
const CURIOUS_WORDS = ["look", "check", "examine", "read", "investigate", "what is", "inspect", "search", "scroll", "open the file"];

export function classify(text: string): Classification {
  const lower = text.toLowerCase();
  if (BOLD_WORDS.some((w) => lower.includes(w))) return "bold";
  if (CAUTIOUS_WORDS.some((w) => lower.includes(w))) return "cautious";
  if (CURIOUS_WORDS.some((w) => lower.includes(w))) return "curious";
  return "neutral";
}

const MID_BEATS: Record<Classification, string[]> = {
  bold: [
    "You don't hesitate — you're on your feet and moving before you've finished the thought. The floorboards protest under you, and for a second the hallway light flickers, like it noticed too.",
    "You close the distance fast. Whatever's down there, you'd rather face it head-on than sit here guessing. Your own footsteps sound too loud in the empty building.",
    "You grab the nearest thing that could pass for a weapon — a stapler, absurdly — and push forward anyway. Bravery, you decide, doesn't have to look dignified.",
  ],
  cautious: [
    "You stay put, pulse ticking in your ears, and let the silence stretch. If something's out there, better it come looking for a sound you're not making.",
    "You ease the laptop shut without a click and slide off the couch, keeping low, keeping quiet. Whatever synced that file can wait until you're not alone anymore.",
    "You back toward the exit one slow step at a time, eyes on the hallway, half-convinced that if you don't blink, nothing down there can move either.",
  ],
  curious: [
    "You lean in instead of away. The file's still open on your screen — rows of timestamps, all from tonight, all from this building. You start reading.",
    "You can't help it — you want to know. You scroll past the noise looking for a name, a location, anything that explains why this file exists at all.",
    "Something about the file structure nags at you. You start cross-referencing folder names against the building directory, and a pattern starts to surface.",
  ],
  neutral: [
    "You're not sure what to make of it yet, so you just watch — the cursor, the hallway, the dark — waiting to see which one moves first.",
  ],
};

const POSE_BY_CLASS: Record<Classification, { sprite_pose: string; facial_expression: string; visual_fx: Array<{ type: string; position: string }> }> = {
  bold: { sprite_pose: "SPRITE_LEANING_IN", facial_expression: "EXPR_SUBTLE_SMILE", visual_fx: [{ type: "ACTION_LINES", position: "top_right" }] },
  cautious: { sprite_pose: "SPRITE_STEP_BACK", facial_expression: "EXPR_SKEPTICAL", visual_fx: [{ type: "SWEAT_DROP", position: "above_head" }] },
  curious: { sprite_pose: "SPRITE_NEUTRAL", facial_expression: "EXPR_SURPRISED", visual_fx: [{ type: "SPARKLE", position: "top_left" }] },
  neutral: { sprite_pose: "SPRITE_NEUTRAL", facial_expression: "EXPR_NEUTRAL", visual_fx: [] },
};

const ENDINGS: Record<Classification | "mixed", { narration: string; ending_mood: string }> = {
  bold: {
    narration:
      "You reach the end of the hallway and there's nothing there — no threat, just a service door left open by a tired janitor, and a laptop fan that finally spins down. You laugh, a little too loud, and pack up to go home. Whatever this was, you walked straight through it.",
    ending_mood: "triumphant",
  },
  cautious: {
    narration:
      "Morning finds you asleep on the couch, laptop closed, hallway door shut and locked like it always was. Maybe you dreamed the whole thing. Maybe you didn't. Either way, you're still here, and that's enough for tonight.",
    ending_mood: "peaceful",
  },
  curious: {
    narration:
      "The file resolves into an answer you didn't expect — not a threat, but a record, the building quietly cataloguing itself. You understand it now, mostly. You're not sure that's better.",
    ending_mood: "bittersweet",
  },
  neutral: {
    narration:
      "You never do find out what opened that door. The file stays on your laptop, unopened folders and all, and some nights you still hear it — the click, just once, right on schedule.",
    ending_mood: "ominous",
  },
  mixed: {
    narration:
      "You never do find out what opened that door. The file stays on your laptop, unopened folders and all, and some nights you still hear it — the click, just once, right on schedule.",
    ending_mood: "ominous",
  },
};

export function tallyEnding(classifications: Classification[]): Classification | "mixed" {
  const counts: Record<Classification, number> = { bold: 0, cautious: 0, curious: 0, neutral: 0 };
  for (const c of classifications) counts[c] += 1;

  const meaningful = (["bold", "cautious", "curious"] as const).map((k) => [k, counts[k]] as const);
  const max = Math.max(...meaningful.map(([, n]) => n));
  if (max === 0) return "neutral";
  const leaders = meaningful.filter(([, n]) => n === max);
  return leaders.length === 1 ? leaders[0][0] : "mixed";
}

/**
 * Deterministic zero-key stand-in for the story orchestrator: classifies the
 * player's action into a small set of buckets via keyword rules and picks
 * narration/visuals from a hand-authored beat bank, so the app is fully
 * demoable and replayable without any API key.
 */
export const mockLlmAdapter: LlmAdapter = {
  name: "mock",
  async generate(ctx: StoryContext) {
    const classification = classify(ctx.transcript);
    const pastClassifications = ctx.history
      .map((h) => h.playerAction)
      .filter((a): a is string => Boolean(a))
      .map(classify);
    const allClassifications = [...pastClassifications, classification];

    if (ctx.forceEnding) {
      const endingKey = tallyEnding(allClassifications);
      const ending = ENDINGS[endingKey];
      const visuals = POSE_BY_CLASS[classification === "neutral" ? "neutral" : classification];
      return {
        narration: ending.narration,
        dialogue: null,
        sprite_pose: visuals.sprite_pose,
        facial_expression: visuals.facial_expression,
        visual_fx: visuals.visual_fx,
        bubble_type: "CAPTION_BOX",
        story_status: "ended",
        ending_mood: ending.ending_mood,
      };
    }

    const lines = MID_BEATS[classification];
    const narration = lines[ctx.beatIndex % lines.length];
    const visuals = POSE_BY_CLASS[classification];

    return {
      narration,
      dialogue: null,
      sprite_pose: visuals.sprite_pose,
      facial_expression: visuals.facial_expression,
      visual_fx: visuals.visual_fx,
      bubble_type: "CAPTION_BOX",
      story_status: "ongoing",
      ending_mood: null,
    };
  },
};
