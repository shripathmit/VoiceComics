import { INK } from "../../sketchFilter";

export const HEAD_CENTER = { x: 238, y: 248 };

/** SPRITE_NEUTRAL — sitting upright at the laptop, relaxed. */
export function PoseNeutral() {
  return (
    <g filter="url(#sketchy)" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* torso */}
      <path d="M215,280 Q210,330 215,400 L265,400 Q270,330 262,280 Q238,268 215,280" />
      {/* left arm to laptop */}
      <path d="M215,290 Q195,310 200,335" />
      {/* right arm to laptop */}
      <path d="M262,290 Q282,310 278,335" />
      {/* laptop */}
      <path d="M195,335 L280,335 L270,352 L205,352 Z" />
      <path d="M200,335 L200,315 L268,315 L268,335" opacity={0.8} />
      {/* legs (seated) */}
      <path d="M218,400 Q216,420 235,422" />
      <path d="M258,400 Q262,420 245,422" />
    </g>
  );
}
