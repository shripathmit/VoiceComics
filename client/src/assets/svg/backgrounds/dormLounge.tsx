import { INK } from "../sketchFilter";

/** bg_dorm_lounge_day — viewBox 0 0 400 500, drawn to sit behind the character layer. */
export function DormLoungeBackground() {
  return (
    <g filter="url(#sketchy)" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round">
      {/* floor line */}
      <line x1="0" y1="420" x2="400" y2="420" />
      {/* back wall baseboard */}
      <line x1="0" y1="90" x2="400" y2="90" strokeDasharray="1 0" opacity={0.5} />
      {/* window */}
      <rect x="270" y="40" width="100" height="80" rx="4" />
      <line x1="320" y1="40" x2="320" y2="120" />
      <line x1="270" y1="80" x2="370" y2="80" />
      {/* couch */}
      <path d="M20,410 L20,340 Q20,320 45,320 L160,320 Q185,320 185,340 L185,410" />
      <line x1="20" y1="380" x2="185" y2="380" />
      <rect x="30" y="350" width="45" height="30" rx="10" opacity={0.6} />
      {/* side table + lamp */}
      <line x1="220" y1="420" x2="220" y2="360" />
      <line x1="200" y1="360" x2="240" y2="360" />
      <path d="M210,360 L215,330 L225,330 L230,360" />
      {/* floor plant */}
      <path d="M355,420 L355,395" />
      <path d="M355,398 Q340,385 335,400" />
      <path d="M355,398 Q370,382 378,398" />
    </g>
  );
}
