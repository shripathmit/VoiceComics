import type { PanelRender } from "@voicecomics/types";
import { SketchFilterDefs, PAPER, INK } from "../../assets/svg/sketchFilter";
import { BackgroundLayer } from "./BackgroundLayer";
import { CharacterLayer } from "./CharacterLayer";
import { FxLayer } from "./FxLayer";
import { SpeechBubble } from "./SpeechBubble";

export function ComicPanel({ panel }: { panel: PanelRender | null }) {
  return (
    <div className="aspect-[4/5] w-full overflow-hidden rounded-2xl border-2 border-neutral-700 bg-[#f5f1e6]">
      <svg viewBox="0 0 400 500" className="h-full w-full">
        <SketchFilterDefs />
        <rect x={0} y={0} width={400} height={500} fill={PAPER} />
        {panel ? (
          <>
            <BackgroundLayer backgroundAssetId={panel.background_asset_id} />
            <CharacterLayer
              pose={panel.character_rig.sprite_pose}
              expression={panel.character_rig.facial_expression}
            />
            <FxLayer fx={panel.visual_fx} pose={panel.character_rig.sprite_pose} />
            <SpeechBubble bubble={panel.speech_bubble} />
          </>
        ) : (
          <text x={200} y={250} textAnchor="middle" fill={INK} fontSize={14}>
            Connecting…
          </text>
        )}
        {/* panel border, drawn last so it reads as a comic-panel frame */}
        <rect
          x={4}
          y={4}
          width={392}
          height={492}
          fill="none"
          stroke={INK}
          strokeWidth={5}
          filter="url(#sketchy)"
        />
      </svg>
    </div>
  );
}
