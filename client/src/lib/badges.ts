import type { Badge, RunSummary } from "./types";

export function computeBadges(runHistory: RunSummary[]): Badge[] {
  const badges: Badge[] = [];

  if (runHistory.some((r) => r.outcome === "success")) {
    badges.push({ id: "rapport_built", label: "Rapport Built", emoji: "🎯" });
  }
  if (runHistory.length > 0 && runHistory.every((r) => r.outcome !== "hard_rejection")) {
    badges.push({ id: "steady_hand", label: "Steady Hand", emoji: "🛡️" });
  }
  if (runHistory.length >= 3) {
    badges.push({ id: "three_reps_in", label: "3 Reps In", emoji: "🔥" });
  }

  return badges;
}
