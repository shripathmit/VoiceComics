import type { SttAdapter, TranscribeInput, TranscribeResult } from "./types.js";
import { env } from "../../config/env.js";

/**
 * Live adapter using Deepgram's pre-recorded transcription REST endpoint.
 * The client sends one audio blob per hold-to-talk turn (not a continuous
 * stream), so a single batch request per turn is the right shape here even
 * though Deepgram also offers a streaming websocket API.
 */
export const deepgramSttAdapter: SttAdapter = {
  name: "deepgram",
  async transcribe(input: TranscribeInput): Promise<TranscribeResult> {
    if (input.mode !== "audio" || !input.audioBase64) {
      throw new Error("deepgram adapter requires audio_payload");
    }
    const audioBuffer = Buffer.from(input.audioBase64, "base64");

    const res = await fetch(
      "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&filler_words=true",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${env.deepgramApiKey}`,
          "Content-Type": input.audioFormat ?? "audio/webm",
        },
        body: audioBuffer,
      }
    );

    if (!res.ok) {
      throw new Error(`Deepgram STT failed: ${res.status} ${await res.text()}`);
    }

    const json = (await res.json()) as {
      results?: {
        channels?: Array<{
          alternatives?: Array<{
            transcript?: string;
            words?: Array<{ word: string; start: number; end: number }>;
          }>;
        }>;
      };
    };

    const alt = json.results?.channels?.[0]?.alternatives?.[0];
    const transcription = alt?.transcript ?? "";
    const words = (alt?.words ?? []).map((w) => ({
      word: w.word,
      start: w.start,
      end: w.end,
    }));
    const durationMs = words.length > 0 ? words[words.length - 1].end * 1000 : 0;

    return { transcription, words, durationMs };
  },
};
