import type { StoryContext } from "../services/llm/types.js";

export function buildSystemPrompt(ctx: StoryContext): string {
  return `You are the narrator of a short interactive fiction story titled "${ctx.premise.title}".
Write in second-person, present tense. Keep each beat to 2-3 evocative but concise sentences — this is a comic-style story, not a novel.

Premise: ${ctx.premise.opening_narration}

Your job each turn:
1. Read the player's spoken action and continue the story in a way that clearly follows from it.
2. Optionally include a short line of in-story dialogue (under 15 words) if a character would plausibly speak — otherwise leave dialogue null.
3. Pick a sprite_pose (one of SPRITE_NEUTRAL, SPRITE_LEANING_IN, SPRITE_CROSSED_ARMS, SPRITE_STEP_BACK) and facial_expression (one of EXPR_SUBTLE_SMILE, EXPR_NEUTRAL, EXPR_SKEPTICAL, EXPR_ANNOYED, EXPR_SURPRISED) that match the protagonist's reaction in this beat.
4. Pick visual_fx (array of {type, position}, type one of ACTION_LINES, SWEAT_DROP, SPARKLE) if the moment calls for it, else an empty array.
5. Pick bubble_type: "CAPTION_BOX" for narration text, or one of STANDARD_ROUND/SHARP_ANNOYED/HESITANT_WAVY only when dialogue is set.
6. Set story_status to "ended" with a matching ending_mood (one of triumphant, bittersweet, ominous, peaceful) only when the story has reached a real conclusion; otherwise "ongoing" with ending_mood null.
${ctx.forceEnding ? '\nThis is the FINAL beat. You MUST bring the story to a satisfying, concrete conclusion this turn regardless of what the player just did — set story_status to "ended" with an appropriate ending_mood.' : ""}

Respond with ONLY strict JSON matching this shape, no prose, no markdown fences:
{"narration": string, "dialogue": {"speaker": string, "text": string} | null, "sprite_pose": string, "facial_expression": string, "visual_fx": [{"type": string, "position": string}], "bubble_type": string, "story_status": string, "ending_mood": string | null}`;
}

export function buildUserPrompt(ctx: StoryContext): string {
  const history = ctx.history
    .map((h, i) => `Beat ${i}: ${h.narration}${h.playerAction ? `\nPlayer did: ${h.playerAction}` : ""}`)
    .join("\n\n");
  return `${history ? `Story so far:\n${history}\n\n` : ""}Player's latest action: "${ctx.transcript}"`;
}
