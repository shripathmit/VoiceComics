import type { RunSummary } from "./types";
import { computeBadges } from "./badges";

export function buildSessionExport(scenarioId: string, runHistory: RunSummary[]) {
  const badges = computeBadges(runHistory);
  const confidencePct =
    runHistory.length === 0
      ? 0
      : Math.round(runHistory.reduce((sum, r) => sum + r.grades.overallScore, 0) / runHistory.length);

  return {
    scenario: scenarioId,
    generated_at: new Date().toISOString(),
    runs: runHistory.map((r) => ({
      run_number: r.runNumber,
      outcome: r.outcome,
      grades: {
        read_the_room: r.grades.readTheRoomGrade,
        tone_consistency: r.grades.toneConsistencyGrade,
      },
      turns: r.turnLog.map((t) => ({
        rapport_delta: t.rapport_delta,
        patience_delta: t.patience_delta,
        comfort_delta: t.comfort_delta,
        tone: t.tone,
        intention: t.intention,
      })),
    })),
    aggregate: {
      confidence_pct: confidencePct,
      conversation_count: runHistory.length,
      badges: badges.map((b) => b.label),
    },
  };
}

export async function copySessionJson(json: unknown): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    return true;
  } catch {
    return false;
  }
}

export function downloadSessionJson(json: unknown, filename = "voicecomics-session.json"): void {
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
