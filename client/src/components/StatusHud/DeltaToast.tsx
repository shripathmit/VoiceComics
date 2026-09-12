import { useEffect, useState } from "react";
import type { StateDeltas } from "@voicecomics/types";
import { useSessionStore } from "../../state/sessionStore";
import { VIBE_ANALYZER_DELAY_MS } from "../../lib/constants";

const LABELS: Array<{ key: keyof StateDeltas; label: string }> = [
  { key: "rapport_delta", label: "Rapport" },
  { key: "patience_delta", label: "Patience" },
  { key: "comfort_delta", label: "Comfort" },
];

export function DeltaToast() {
  const lastDeltas = useSessionStore((s) => s.lastDeltas);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastDeltas) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), VIBE_ANALYZER_DELAY_MS + 700);
    return () => clearTimeout(timer);
  }, [lastDeltas]);

  if (!visible || !lastDeltas) return null;

  const pills = LABELS.filter(({ key }) => lastDeltas[key] !== 0);
  if (pills.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5 px-4">
      {pills.map(({ key, label }) => {
        const value = lastDeltas[key];
        const positive = value > 0;
        return (
          <span
            key={key}
            className={`rounded-full border px-2 py-1 text-[11px] font-semibold shadow-lg ${
              positive
                ? "border-emerald-500 bg-emerald-950 text-emerald-300"
                : "border-red-500 bg-red-950 text-red-300"
            }`}
          >
            {positive ? "+" : ""}
            {value} {label}
          </span>
        );
      })}
    </div>
  );
}
