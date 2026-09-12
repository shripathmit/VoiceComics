import type { StateVector } from "@voicecomics/types";

const BARS: Array<{ key: keyof StateVector; label: string; color: string }> = [
  { key: "rapport_score", label: "Rapport", color: "bg-pink-500" },
  { key: "patience_level", label: "Patience", color: "bg-amber-400" },
  { key: "comfort_level", label: "Comfort", color: "bg-emerald-400" },
];

export function StateBars({ state }: { state: StateVector | null }) {
  return (
    <div className="grid grid-cols-3 gap-2 px-1">
      {BARS.map(({ key, label, color }) => {
        const value = state ? state[key] : 0;
        return (
          <div key={key} className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide text-neutral-400">{label}</span>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-700">
              <div
                className={`h-full ${color} transition-all duration-500`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
