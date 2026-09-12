import { useEffect, useState } from "react";
import { useSessionStore } from "../../state/sessionStore";
import { VIBE_ANALYZER_DELAY_MS } from "../../lib/constants";

export function VibeAnalyzerCard() {
  const lastSystemRead = useSessionStore((s) => s.lastSystemRead);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastSystemRead) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), VIBE_ANALYZER_DELAY_MS);
    return () => clearTimeout(timer);
  }, [lastSystemRead]);

  if (!visible || !lastSystemRead) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center px-4">
      <div className="flex items-center gap-2 rounded-xl border-2 border-neutral-600 bg-neutral-900/95 px-3 py-2 text-xs shadow-lg">
        <span className="font-semibold uppercase tracking-wide text-neutral-400">Vibe Analyzer</span>
        <span className="text-neutral-200">
          Tone: <span className="font-semibold">{lastSystemRead.tone}</span>
        </span>
        <span className="text-neutral-600">·</span>
        <span className="text-neutral-200">
          Intention: <span className="font-semibold">{lastSystemRead.intention}</span>
        </span>
      </div>
    </div>
  );
}
