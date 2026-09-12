import type { LlmAdapter, OrchestratorContext } from "./types.js";
import { buildSystemPrompt, buildUserPrompt } from "../../orchestrator/promptTemplate.js";
import { env } from "../../config/env.js";

export const openAiLlmAdapter: LlmAdapter = {
  name: "openai",
  async generate(ctx: OrchestratorContext): Promise<unknown> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.8,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildSystemPrompt(ctx) },
          { role: "user", content: buildUserPrompt(ctx) },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI orchestrator call failed: ${res.status} ${await res.text()}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenAI response had no content");
    return JSON.parse(content);
  },
};
