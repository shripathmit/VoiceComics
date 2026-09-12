import type { LlmAdapter, OrchestratorContext } from "./types.js";

const RUDE_WORDS = [
  "shut up",
  "stupid",
  "idiot",
  "shut it",
  "get lost",
  "whatever loser",
  "ugly",
  "creep",
  "touch you",
  "sit on your lap",
];
const POLITE_MARKERS = ["mind if", "please", "hey", "hi ", "hello", "sorry", "thanks", "cool", "excuse me"];
const CURIOUS_MARKERS = ["what are you", "studying", "working on", "what's that", "you like", "into"];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Deterministic zero-key stand-in for the LLM orchestrator. Scores the
 * transcript with simple keyword/heuristic rules against the current
 * prosody so the app is fully demoable without any API key.
 */
export const mockLlmAdapter: LlmAdapter = {
  name: "mock",
  async generate(ctx: OrchestratorContext) {
    const text = ctx.transcript.toLowerCase();
    const { prosody } = ctx;

    let rapportDelta = 0;
    let patienceDelta = 0;
    let comfortDelta = 0;
    let boundaryViolation = false;

    const isRude = RUDE_WORDS.some((w) => text.includes(w));
    const isPolite = POLITE_MARKERS.some((w) => text.includes(w));
    const isCurious = CURIOUS_MARKERS.some((w) => text.includes(w));

    if (isRude) {
      rapportDelta -= 22;
      patienceDelta -= 25;
      comfortDelta -= 18;
      boundaryViolation = true;
    } else {
      if (isPolite) {
        rapportDelta += 10;
        comfortDelta += 8;
      }
      if (isCurious) {
        rapportDelta += 8;
        comfortDelta += 6;
      }
      if (!isPolite && !isCurious) {
        // neutral small talk still gets a small, cautious bump
        rapportDelta += 2;
      }

      // prosody adjustments
      if (prosody.filler_word_count >= 3) {
        patienceDelta -= 4;
        rapportDelta -= 2;
      }
      if (prosody.energy_classification === "high_aggressive") {
        rapportDelta -= 10;
        patienceDelta -= 8;
      } else if (prosody.energy_classification === "low_hesitant") {
        comfortDelta -= 2;
      } else if (prosody.energy_classification === "high_confident") {
        rapportDelta += 3;
      }
      if (prosody.initiation_latency_ms > 6000) {
        patienceDelta -= 3;
      }
      if (patienceDelta >= 0) patienceDelta += 2; // baseline patience regen on a non-hostile turn
    }

    rapportDelta = clamp(rapportDelta, -30, 20);
    patienceDelta = clamp(patienceDelta, -30, 10);
    comfortDelta = clamp(comfortDelta, -20, 20);

    const projectedRapport = ctx.currentState.rapport_score + rapportDelta;

    let sprite_pose: string;
    let facial_expression: string;
    let bubble_type: string;
    let dialogue: string;
    let visual_fx: Array<{ type: string; position: string }>;

    if (boundaryViolation) {
      sprite_pose = "SPRITE_STEP_BACK";
      facial_expression = "EXPR_ANNOYED";
      bubble_type = "SHARP_ANNOYED";
      visual_fx = [{ type: "ACTION_LINES", position: "top_right" }];
      dialogue = "Whoa, not cool. I'm gonna go sit somewhere else.";
    } else if (isPolite && isCurious) {
      sprite_pose = "SPRITE_LEANING_IN";
      facial_expression = "EXPR_SUBTLE_SMILE";
      bubble_type = "STANDARD_ROUND";
      visual_fx = [{ type: "SPARKLE", position: "top_left" }];
      dialogue = "Yeah, go for it — I'm just finishing a problem set.";
    } else if (isPolite) {
      sprite_pose = "SPRITE_NEUTRAL";
      facial_expression = "EXPR_SUBTLE_SMILE";
      bubble_type = "STANDARD_ROUND";
      visual_fx = [];
      dialogue = "Sure, nobody's sitting there.";
    } else if (prosody.energy_classification === "low_hesitant") {
      sprite_pose = "SPRITE_NEUTRAL";
      facial_expression = "EXPR_SKEPTICAL";
      bubble_type = "HESITANT_WAVY";
      visual_fx = [{ type: "SWEAT_DROP", position: "above_head" }];
      dialogue = "Uh... okay, I guess?";
    } else {
      sprite_pose = "SPRITE_CROSSED_ARMS";
      facial_expression = "EXPR_SKEPTICAL";
      bubble_type = "STANDARD_ROUND";
      visual_fx = [];
      dialogue = "I mean, sure. Just gimme some quiet.";
    }

    if (projectedRapport <= 15 && !boundaryViolation) {
      facial_expression = "EXPR_ANNOYED";
    }

    const detected_tone = isRude ? "Rude" : isPolite ? "Polite" : "Neutral";
    const detected_intention = boundaryViolation
      ? "Hostile"
      : isCurious
        ? "Curious"
        : isPolite
          ? "Direct"
          : "Casual";

    return {
      rapport_delta: rapportDelta,
      patience_delta: patienceDelta,
      comfort_delta: comfortDelta,
      boundary_violation: boundaryViolation,
      sprite_pose,
      facial_expression,
      visual_fx,
      bubble_type,
      dialogue,
      detected_tone,
      detected_intention,
    };
  },
};
