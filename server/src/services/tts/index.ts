import type { TtsAdapter } from "./types.js";
import { mockTtsAdapter } from "./mock.js";
import { elevenLabsTtsAdapter } from "./elevenlabs.js";
import { env } from "../../config/env.js";

export * from "./types.js";

export function resolveTtsAdapter(): TtsAdapter {
  if (env.ttsProvider === "elevenlabs") {
    if (!env.elevenLabsApiKey) {
      console.warn(
        "[tts] TTS_PROVIDER=elevenlabs but ELEVENLABS_API_KEY is missing — falling back to mock (client-side) TTS"
      );
      return mockTtsAdapter;
    }
    return elevenLabsTtsAdapter;
  }
  return mockTtsAdapter;
}
