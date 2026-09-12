import type { RunGrades, TurnLogEntry } from "./types";

// Weighted per-turn delta range, from packages/types/src/state.ts's StateDeltasSchema bounds:
// rapport [-30,20], patience [-30,10], comfort [-20,20], weighted 0.4/0.2/0.4.
const ROOM_MIN = -30 * 0.4 + -30 * 0.2 + -20 * 0.4; // -26
const ROOM_MAX = 20 * 0.4 + 10 * 0.2 + 20 * 0.4; // 18

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function normalize(value: number, min: number, max: number): number {
  return clamp(((value - min) / (max - min)) * 100, 0, 100);
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdev(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  return Math.sqrt(mean(values.map((v) => (v - m) ** 2)));
}

export function scoreToLetterGrade(score: number): string {
  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 60) return "D";
  return "F";
}

export function computeRunGrades(turnLog: TurnLogEntry[]): RunGrades {
  if (turnLog.length === 0) {
    return {
      readTheRoomGrade: "C",
      toneConsistencyGrade: "C",
      readTheRoomScore: 70,
      toneConsistencyScore: 70,
      overallScore: 70,
    };
  }

  const weightedDeltas = turnLog.map(
    (t) => t.rapport_delta * 0.4 + t.comfort_delta * 0.4 + t.patience_delta * 0.2
  );
  const readTheRoomScore = normalize(mean(weightedDeltas), ROOM_MIN, ROOM_MAX);

  const confidenceScores = turnLog.map((t) => t.prosody.confidence_score * 100);
  const rudeTurns = turnLog.filter((t) => t.tone === "Rude").length;
  const toneConsistencyScore = clamp(
    mean(confidenceScores) - stdev(confidenceScores) * 0.5 - rudeTurns * 15,
    0,
    100
  );

  return {
    readTheRoomGrade: scoreToLetterGrade(readTheRoomScore),
    toneConsistencyGrade: scoreToLetterGrade(toneConsistencyScore),
    readTheRoomScore: Math.round(readTheRoomScore),
    toneConsistencyScore: Math.round(toneConsistencyScore),
    overallScore: Math.round((readTheRoomScore + toneConsistencyScore) / 2),
  };
}
