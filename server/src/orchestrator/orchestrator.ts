import { OrchestratorOutputSchema, type OrchestratorOutput } from "@voicecomics/types";
import type { SessionState } from "../session/types.js";
import type { LlmAdapter, OrchestratorContext } from "../services/llm/types.js";
import { mockLlmAdapter } from "../services/llm/mock.js";

const SAFE_FALLBACK_OUTPUT: OrchestratorOutput = {
  rapport_delta: 0,
  patience_delta: -2,
  comfort_delta: 0,
  boundary_violation: false,
  sprite_pose: "SPRITE_NEUTRAL",
  facial_expression: "EXPR_NEUTRAL",
  visual_fx: [],
  bubble_type: "STANDARD_ROUND",
  dialogue: "Sorry, what was that?",
};

/**
 * Calls the LLM adapter for a structured turn evaluation, validates the
 * result, retries once on a parse/validation failure, and otherwise falls
 * back to a safe neutral response so a session never crashes mid-turn.
 */
export async function evaluateTurn(
  llm: LlmAdapter,
  session: SessionState,
  transcript: string,
  prosody: OrchestratorContext["prosody"]
): Promise<OrchestratorOutput> {
  const ctx: OrchestratorContext = {
    character: session.character,
    currentState: session.state,
    transcript,
    prosody,
    recentHistory: session.history.slice(-6),
  };

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await llm.generate(ctx);
      const parsed = OrchestratorOutputSchema.safeParse(raw);
      if (parsed.success) return parsed.data;
      console.warn(`[orchestrator] validation failed on attempt ${attempt + 1}:`, parsed.error.message);
    } catch (err) {
      console.warn(`[orchestrator] llm call failed on attempt ${attempt + 1}:`, err);
    }
  }

  // Last resort: the deterministic mock adapter always produces valid output.
  try {
    const fallbackRaw = await mockLlmAdapter.generate(ctx);
    const parsedFallback = OrchestratorOutputSchema.safeParse(fallbackRaw);
    if (parsedFallback.success) return parsedFallback.data;
  } catch {
    // fall through to the static safe response below
  }

  return SAFE_FALLBACK_OUTPUT;
}
