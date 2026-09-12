import type { ConversationStatus, StateDeltas, StateVector } from "@voicecomics/types";

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

export function applyDeltas(state: StateVector, deltas: StateDeltas): StateVector {
  return {
    rapport_score: clamp(state.rapport_score + deltas.rapport_delta, 0, 100),
    patience_level: clamp(state.patience_level + deltas.patience_delta, 0, 100),
    comfort_level: clamp(state.comfort_level + deltas.comfort_delta, 0, 100),
  };
}

export function checkTermination(
  state: StateVector,
  boundaryViolation: boolean
): ConversationStatus {
  if (state.rapport_score <= 15 || boundaryViolation) return "hard_rejection";
  if (state.patience_level <= 20) return "soft_disengage";
  if (state.rapport_score >= 75 && state.patience_level > 30) return "success";
  return "ongoing";
}
