import { useEffect, useState } from "react";
import { useSessionStore } from "../../state/sessionStore";

const CONNECTION_COLOR: Record<string, string> = {
  connecting: "bg-amber-400",
  open: "bg-emerald-400",
  closed: "bg-red-500",
};

export function LatencyIndicator() {
  const connectionStatus = useSessionStore((s) => s.connectionStatus);
  const turnPhase = useSessionStore((s) => s.turnPhase);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (turnPhase !== "thinking") {
      setElapsedMs(0);
      return;
    }
    const startedAt = Date.now();
    const interval = setInterval(() => setElapsedMs(Date.now() - startedAt), 250);
    return () => clearInterval(interval);
  }, [turnPhase]);

  let latencyLabel: string | null = null;
  if (turnPhase === "thinking" && elapsedMs > 15000) {
    latencyLabel = "This is taking a while — check your connection.";
  } else if (turnPhase === "thinking" && elapsedMs > 4000) {
    latencyLabel = "Still thinking…";
  }

  return (
    <div className="flex items-center justify-between px-1 text-[11px] text-neutral-400">
      <div className="flex items-center gap-1.5">
        <span className={`h-2 w-2 rounded-full ${CONNECTION_COLOR[connectionStatus]}`} />
        <span className="capitalize">{connectionStatus}</span>
      </div>
      {latencyLabel && <span className="text-amber-300">{latencyLabel}</span>}
    </div>
  );
}
