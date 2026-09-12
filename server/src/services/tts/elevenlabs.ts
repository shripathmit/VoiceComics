import type { TtsAdapter, TtsResult } from "./types.js";
import { env } from "../../config/env.js";

// A default pre-made ElevenLabs voice ("Adam"); override via ELEVENLABS_VOICE_ID if desired.
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "pNInz6obpgDQGcFmaJgB";

export const elevenLabsTtsAdapter: TtsAdapter = {
  name: "elevenlabs",
  async synthesize(text: string): Promise<TtsResult> {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: "POST",
      headers: {
        "xi-api-key": env.elevenLabsApiKey ?? "",
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: { stability: 0.4, similarity_boost: 0.75 },
      }),
    });

    if (!res.ok) {
      throw new Error(`ElevenLabs TTS failed: ${res.status} ${await res.text()}`);
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    return { audioDataUrl: `data:audio/mpeg;base64,${base64}`, useClientTts: false };
  },
};
