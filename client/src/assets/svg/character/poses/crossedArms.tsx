import { INK } from "../../sketchFilter";

export const HEAD_CENTER = { x: 238, y: 246 };

/** SPRITE_CROSSED_ARMS — guarded, arms folded, slightly turned away. */
export function PoseCrossedArms() {
  return (
    <g filter="url(#sketchy)" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* torso, squared off */}
      <path d="M212,278 Q205,332 212,400 L268,400 Q275,332 266,278 Q240,264 212,278" />
      {/* crossed arms as one folded band across the chest */}
      <path d="M205,310 Q238,326 272,308" />
      <path d="M205,318 Q238,334 272,316" />
      {/* laptop pushed slightly away */}
      <path d="M198,340 L275,336 L268,352 L206,354 Z" opacity={0.7} />
      {/* legs */}
      <path d="M216,400 Q214,420 233,423" />
      <path d="M262,400 Q266,420 249,423" />
    </g>
  );
}
