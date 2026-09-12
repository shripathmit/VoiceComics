import { INK } from "../../sketchFilter";

export const HEAD_CENTER = { x: 258, y: 236 };

/** SPRITE_STEP_BACK — pulling away, disengaging, packing up. */
export function PoseStepBack() {
  return (
    <g filter="url(#sketchy)" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* torso, shifted right and upright — pulling away */}
      <path d="M232,270 Q224,326 232,398 L288,398 Q296,326 286,270 Q260,256 232,270" />
      {/* arm pulling laptop shut */}
      <path d="M236,300 Q220,296 214,282" />
      <path d="M282,296 Q300,290 298,272" />
      {/* laptop, lid closing */}
      <path d="M215,336 L295,330 L286,346 L222,350 Z" opacity={0.6} />
      <line x1="215" y1="336" x2="222" y2="350" opacity={0.4} />
      {/* legs, weight shifted back */}
      <path d="M236,398 Q230,418 248,424" />
      <path d="M282,398 Q288,418 268,426" />
    </g>
  );
}
