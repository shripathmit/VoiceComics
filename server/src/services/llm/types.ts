import type { CharacterDefinition, StateVector, ProsodyMetrics } from "@voicecomics/types";

export interface TurnRecord {
  speaker: "user" | "character";
  text: string;
}

export interface OrchestratorContext {
  character: CharacterDefinition;
  currentState: StateVector;
  transcript: string;
  prosody: ProsodyMetrics;
  recentHistory: TurnRecord[];
}

export interface LlmAdapter {
  readonly name: string;
  /** Returns a parsed-but-unvalidated object — the orchestrator validates it against OrchestratorOutputSchema. */
  generate(ctx: OrchestratorContext): Promise<unknown>;
}
