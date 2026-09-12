import { INK } from "../sketchFilter";

export function ActionLines({ x, y }: { x: number; y: number }) {
  const lines = [-18, -6, 6, 18];
  return (
    <g filter="url(#sketchy)" stroke={INK} strokeWidth={2.5} strokeLinecap="round" transform={`translate(${x},${y})`}>
      {lines.map((dx) => (
        <line key={dx} x1={dx} y1={-20} x2={dx * 1.4} y2={4} />
      ))}
    </g>
  );
}
