import type { StoryPremise, ProsodyMetrics } from "@voicecomics/types";
import type { StoryBeatRecord } from "../../session/types.js";

export interface StoryContext {
  premise: StoryPremise;
  transcript: string;
  prosody: ProsodyMetrics;
  history: StoryBeatRecord[];
  beatIndex: number;
  forceEnding: boolean;
}

export interface LlmAdapter {
  readonly name: string;
  /** Returns a parsed-but-unvalidated object — the orchestrator validates it against StoryOrchestratorOutputSchema. */
  generate(ctx: StoryContext): Promise<unknown>;
}
