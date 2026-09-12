import { INK } from "../sketchFilter";

export function Sparkle({ x, y }: { x: number; y: number }) {
  return (
    <g filter="url(#sketchy)" stroke={INK} strokeWidth={2} fill="#ffe89b" transform={`translate(${x},${y})`}>
      <path d="M0,-12 L3,-3 L12,0 L3,3 L0,12 L-3,3 L-12,0 L-3,-3 Z" />
    </g>
  );
}
