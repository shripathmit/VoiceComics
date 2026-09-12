import type { SttAdapter } from "./types.js";
import { mockSttAdapter } from "./mock.js";
import { deepgramSttAdapter } from "./deepgram.js";
import { env } from "../../config/env.js";

export * from "./types.js";

export function resolveSttAdapter(): SttAdapter {
  if (env.sttProvider === "deepgram") {
    if (!env.deepgramApiKey) {
      console.warn(
        "[stt] STT_PROVIDER=deepgram but DEEPGRAM_API_KEY is missing — falling back to mock STT"
      );
      return mockSttAdapter;
    }
    return deepgramSttAdapter;
  }
  return mockSttAdapter;
}
