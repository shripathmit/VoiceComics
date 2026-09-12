import { INK } from "../../sketchFilter";

export const HEAD_CENTER = { x: 222, y: 258 };

/** SPRITE_LEANING_IN — turned toward the visitor, open posture. */
export function PoseLeaningIn() {
  return (
    <g filter="url(#sketchy)" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* torso, rotated slightly toward viewer */}
      <path d="M198,288 Q188,335 198,400 L252,404 Q262,340 250,288 Q222,272 198,288" />
      {/* near arm resting open, gesturing */}
      <path d="M200,300 Q175,308 170,290" />
      {/* far arm toward laptop */}
      <path d="M248,296 Q268,312 264,336" />
      {/* laptop, slightly turned away */}
      <path d="M225,336 L285,332 L278,350 L232,352 Z" opacity={0.85} />
      {/* legs */}
      <path d="M202,402 Q200,420 220,424" />
      <path d="M244,404 Q250,422 232,426" />
    </g>
  );
}
