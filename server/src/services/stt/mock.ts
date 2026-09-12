import type { SttAdapter, TranscribeInput, TranscribeResult } from "./types.js";

/**
 * Zero-key adapter: expects the client to have sent typed text (mode "text").
 * Fabricates plausible word timestamps from the text so downstream prosody
 * extraction has something to work with even without real audio.
 */
export const mockSttAdapter: SttAdapter = {
  name: "mock",
  async transcribe(input: TranscribeInput): Promise<TranscribeResult> {
    const text = input.text?.trim() || "...";
    const words = text.split(/\s+/).filter(Boolean);
    const msPerWord = 260; // ~230 wpm typing-to-speech approximation
    const timestamps = words.map((word, i) => ({
      word,
      start: (i * msPerWord) / 1000,
      end: ((i + 1) * msPerWord) / 1000,
    }));
    return {
      transcription: text,
      words: timestamps,
      durationMs: words.length * msPerWord,
    };
  },
};
