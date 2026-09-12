import type { ProsodyMetrics } from "@voicecomics/types";
import type { TranscribeResult } from "../services/stt/types.js";

const FILLER_WORDS = /\b(um+|uh+|like|you know|i mean|so yeah)\b/gi;

export interface ExtractProsodyInput {
  transcribeResult: TranscribeResult;
  /** ms between the previous turn ending (or session start) and this turn's audio starting */
  initiationLatencyMs: number;
}

export function extractProsody({
  transcribeResult,
  initiationLatencyMs,
}: ExtractProsodyInput): ProsodyMetrics {
  const { transcription, words, durationMs } = transcribeResult;

  const wordCount = words.length || transcription.split(/\s+/).filter(Boolean).length;
  const durationMinutes = Math.max(durationMs, 1) / 60000;
  const speechRateWpm = Math.round(wordCount / durationMinutes) || 0;

  const fillerMatches = transcription.match(FILLER_WORDS);
  const fillerWordCount = fillerMatches ? fillerMatches.length : 0;

  let energyClassification: ProsodyMetrics["energy_classification"] = "moderate_calm";
  if (speechRateWpm > 190 || /[!]{2,}|[A-Z]{4,}/.test(transcription)) {
    energyClassification = "high_aggressive";
  } else if (speechRateWpm > 0 && speechRateWpm < 90) {
    energyClassification = "low_hesitant";
  } else if (speechRateWpm >= 90 && speechRateWpm <= 190 && fillerWordCount === 0) {
    energyClassification = "high_confident";
  }

  const confidenceScore = Math.max(
    0.3,
    Math.min(0.98, 0.95 - fillerWordCount * 0.08 - (initiationLatencyMs > 8000 ? 0.15 : 0))
  );

  return {
    speech_rate_wpm: speechRateWpm,
    filler_word_count: fillerWordCount,
    initiation_latency_ms: Math.round(initiationLatencyMs),
    energy_classification: energyClassification,
    confidence_score: Number(confidenceScore.toFixed(2)),
  };
}
