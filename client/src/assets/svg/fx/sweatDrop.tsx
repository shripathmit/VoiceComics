import { INK } from "../sketchFilter";

export function SweatDrop({ x, y }: { x: number; y: number }) {
  return (
    <g filter="url(#sketchy)" stroke={INK} strokeWidth={2} fill="#bfe3ff" transform={`translate(${x},${y})`}>
      <path d="M0,0 Q7,10 0,18 Q-7,10 0,0 Z" />
    </g>
  );
}
