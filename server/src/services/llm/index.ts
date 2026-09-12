import type { LlmAdapter } from "./types.js";
import { mockLlmAdapter } from "./mock.js";
import { openAiLlmAdapter } from "./openai.js";
import { env } from "../../config/env.js";

export * from "./types.js";

export function resolveLlmAdapter(): LlmAdapter {
  if (env.llmProvider === "openai") {
    if (!env.openaiApiKey) {
      console.warn(
        "[llm] LLM_PROVIDER=openai but OPENAI_API_KEY is missing — falling back to mock orchestrator"
      );
      return mockLlmAdapter;
    }
    return openAiLlmAdapter;
  }
  return mockLlmAdapter;
}
