import { StoryOrchestratorOutputSchema, type StoryOrchestratorOutput } from "@voicecomics/types";
import type { SessionState } from "../session/types.js";
import type { LlmAdapter, StoryContext } from "../services/llm/types.js";
import { mockLlmAdapter } from "../services/llm/mock.js";
import { MAX_STORY_BEATS } from "./constants.js";

function safeFallbackOutput(forceEnding: boolean): StoryOrchestratorOutput {
  return {
    narration: forceEnding
      ? "The story pauses here — the night settles, and whatever was about to happen fades back into the quiet of the empty building."
      : "The story pauses for a moment, waiting to see what you do next.",
    dialogue: null,
    sprite_pose: "SPRITE_NEUTRAL",
    facial_expression: "EXPR_NEUTRAL",
    visual_fx: [],
    bubble_type: "CAPTION_BOX",
    story_status: forceEnding ? "ended" : "ongoing",
    ending_mood: forceEnding ? "ominous" : null,
  };
}

/**
 * Calls the LLM adapter for the next story beat, validates the result,
 * retries once on a parse/validation failure, and otherwise falls back to a
 * safe neutral beat so a story never crashes mid-turn.
 */
export async function continueStory(
  llm: LlmAdapter,
  session: SessionState,
  transcript: string,
  prosody: StoryContext["prosody"]
): Promise<StoryOrchestratorOutput> {
  const forceEnding = session.beatIndex + 1 >= MAX_STORY_BEATS;
  const ctx: StoryContext = {
    premise: session.premise,
    transcript,
    prosody,
    history: session.history.slice(-6),
    beatIndex: session.beatIndex,
    forceEnding,
  };

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await llm.generate(ctx);
      const parsed = StoryOrchestratorOutputSchema.safeParse(raw);
      if (parsed.success) return parsed.data;
      console.warn(`[orchestrator] validation failed on attempt ${attempt + 1}:`, parsed.error.message);
    } catch (err) {
      console.warn(`[orchestrator] llm call failed on attempt ${attempt + 1}:`, err);
    }
  }

  // Last resort: the deterministic mock adapter always produces valid output.
  try {
    const fallbackRaw = await mockLlmAdapter.generate(ctx);
    const parsedFallback = StoryOrchestratorOutputSchema.safeParse(fallbackRaw);
    if (parsedFallback.success) return parsedFallback.data;
  } catch {
    // fall through to the static safe response below
  }

  return safeFallbackOutput(forceEnding);
}
