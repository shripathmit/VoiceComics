import type { SpritePose, VisualFx } from "@voicecomics/types";
import { SweatDrop } from "../../assets/svg/fx/sweatDrop";
import { ActionLines } from "../../assets/svg/fx/actionLines";
import { Sparkle } from "../../assets/svg/fx/sparkle";
import { POSES } from "./CharacterLayer";

const POSITIONS: Record<VisualFx["position"], { x: number; y: number }> = {
  top_right: { x: 330, y: 70 },
  top_left: { x: 70, y: 70 },
  center: { x: 200, y: 200 },
  above_head: { x: 0, y: 0 }, // resolved relative to the character's head anchor below
};

export function FxLayer({ fx, pose }: { fx: VisualFx[]; pose: SpritePose }) {
  const head = (POSES[pose] ?? POSES.SPRITE_NEUTRAL).head;

  return (
    <g>
      {fx.map((effect, i) => {
        const base = POSITIONS[effect.position];
        const point = effect.position === "above_head" ? { x: head.x + 18, y: head.y - 32 } : base;
        if (effect.type === "SWEAT_DROP") return <SweatDrop key={i} x={point.x} y={point.y} />;
        if (effect.type === "ACTION_LINES") return <ActionLines key={i} x={point.x} y={point.y} />;
        if (effect.type === "SPARKLE") return <Sparkle key={i} x={point.x} y={point.y} />;
        return null;
      })}
    </g>
  );
}
