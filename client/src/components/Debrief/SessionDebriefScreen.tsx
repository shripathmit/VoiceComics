import { useState } from "react";
import { useSessionStore } from "../../state/sessionStore";
import { ComicPanel } from "../ComicPanel/ComicPanel";
import { computeBadges } from "../../lib/badges";
import { buildSessionExport, copySessionJson, downloadSessionJson } from "../../lib/sessionExport";
import { CHARACTER_ID } from "../../lib/constants";
import { socket } from "../../services/ws/socket";

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export function SessionDebriefScreen() {
  const runHistory = useSessionStore((s) => s.runHistory);
  const resetSession = useSessionStore((s) => s.resetSession);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  const scores = runHistory.map((r) => r.grades.overallScore);
  const confidencePct = average(scores);
  const previousPct = runHistory.length > 1 ? average(scores.slice(0, -1)) : null;
  const badges = computeBadges(runHistory);
  const exportJson = buildSessionExport(CHARACTER_ID, runHistory);

  const handleCopy = async () => {
    const ok = await copySessionJson(exportJson);
    setCopyStatus(ok ? "copied" : "failed");
    setTimeout(() => setCopyStatus("idle"), 2000);
  };

  const handleNewSession = () => {
    resetSession();
    socket.send({ event: "start_session", character_id: CHARACTER_ID });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto pb-2">
      <h2 className="font-sketch text-lg font-bold">Session Debrief</h2>

      <section>
        <p className="mb-2 text-[11px] uppercase tracking-wide text-neutral-400">Full strip</p>
        <div className="grid grid-cols-3 gap-2">
          {runHistory.map((run) => (
            <div key={run.runNumber} className="flex flex-col gap-1">
              <ComicPanel panel={run.panelRender} />
              <p className="text-center text-[10px] text-neutral-500">Run {run.runNumber}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border-2 border-neutral-700 bg-neutral-900 px-4 py-3">
        <p className="mb-1 text-[11px] uppercase tracking-wide text-neutral-400">Confidence</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold">{confidencePct}%</span>
          {previousPct !== null && (
            <span className={confidencePct >= previousPct ? "text-emerald-400" : "text-red-400"}>
              {confidencePct >= previousPct ? "+" : ""}
              {confidencePct - previousPct}% since last run
            </span>
          )}
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-700">
          <div className="h-full bg-emerald-400 transition-all duration-500" style={{ width: `${confidencePct}%` }} />
        </div>
        <div className="mt-3 flex gap-4 text-sm text-neutral-300">
          <span>Conversations: {runHistory.length}</span>
          <span>Badges: {badges.length}</span>
        </div>
        {badges.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {badges.map((b) => (
              <span key={b.id} className="rounded-full border border-neutral-600 bg-neutral-800 px-2 py-1 text-xs">
                {b.emoji} {b.label}
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border-2 border-neutral-700 bg-neutral-900 px-4 py-3">
        <p className="mb-2 text-[11px] uppercase tracking-wide text-neutral-400">Developer handoff</p>
        <p className="mb-3 text-sm text-neutral-300">A valuable practice session. Ready for handoff!</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="min-h-[44px] flex-1 rounded-xl border-2 border-neutral-600 bg-neutral-800 px-3 text-sm font-semibold active:bg-neutral-700"
          >
            {copyStatus === "copied" ? "Copied!" : copyStatus === "failed" ? "Copy failed" : "Copy JSON"}
          </button>
          <button
            type="button"
            onClick={() => downloadSessionJson(exportJson)}
            className="min-h-[44px] flex-1 rounded-xl border-2 border-neutral-600 bg-neutral-800 px-3 text-sm font-semibold active:bg-neutral-700"
          >
            Download
          </button>
        </div>
      </section>

      <button
        type="button"
        onClick={handleNewSession}
        className="min-h-[52px] rounded-xl border-2 border-emerald-600 bg-emerald-950 px-6 font-semibold text-emerald-300 active:bg-emerald-900"
      >
        Start a new session
      </button>
    </div>
  );
}
