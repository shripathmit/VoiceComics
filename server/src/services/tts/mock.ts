import type { TtsAdapter, TtsResult } from "./types.js";

export const mockTtsAdapter: TtsAdapter = {
  name: "mock",
  async synthesize(): Promise<TtsResult> {
    return { audioDataUrl: null, useClientTts: true };
  },
};
