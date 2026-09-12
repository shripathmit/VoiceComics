import type { FacialExpression, SpritePose } from "@voicecomics/types";
import { PoseNeutral, HEAD_CENTER as NEUTRAL_HEAD } from "../../assets/svg/character/poses/neutral";
import { PoseLeaningIn, HEAD_CENTER as LEANING_HEAD } from "../../assets/svg/character/poses/leaningIn";
import { PoseCrossedArms, HEAD_CENTER as CROSSED_HEAD } from "../../assets/svg/character/poses/crossedArms";
import { PoseStepBack, HEAD_CENTER as STEPBACK_HEAD } from "../../assets/svg/character/poses/stepBack";
import { Face } from "../../assets/svg/character/Face";

const POSES: Record<SpritePose, { Body: () => JSX.Element; head: { x: number; y: number } }> = {
  SPRITE_NEUTRAL: { Body: PoseNeutral, head: NEUTRAL_HEAD },
  SPRITE_LEANING_IN: { Body: PoseLeaningIn, head: LEANING_HEAD },
  SPRITE_CROSSED_ARMS: { Body: PoseCrossedArms, head: CROSSED_HEAD },
  SPRITE_STEP_BACK: { Body: PoseStepBack, head: STEPBACK_HEAD },
};

export function CharacterLayer({
  pose,
  expression,
}: {
  pose: SpritePose;
  expression: FacialExpression;
}) {
  const { Body, head } = POSES[pose] ?? POSES.SPRITE_NEUTRAL;
  return (
    <g>
      <Body />
      <Face center={head} expression={expression} />
    </g>
  );
}

export { POSES };
