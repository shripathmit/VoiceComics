import type { PanelRender, StoryOrchestratorOutput, StoryStatus } from "@voicecomics/types";
import type { SessionState } from "../session/types.js";
import type { TtsResult } from "../services/tts/types.js";

export function buildPanelRender(
  session: SessionState,
  output: StoryOrchestratorOutput,
  tts: TtsResult,
  status: StoryStatus
): PanelRender {
  const isDialogue = output.dialogue !== null;

  return {
    panel_id: `p_${String(session.beatIndex).padStart(2, "0")}`,
    background_asset_id: session.premise.background_asset_id,
    character_rig: {
      character_id: session.premise.premise_id,
      sprite_pose: output.sprite_pose,
      facial_expression: output.facial_expression,
    },
    visual_fx: output.visual_fx,
    speech_bubble: {
      speaker: isDialogue ? output.dialogue!.speaker : "",
      text: isDialogue ? output.dialogue!.text : output.narration,
      bubble_type: output.bubble_type,
      tail_anchor: { x: 0.62, y: 0.38 },
    },
    audio_stream_url: tts.audioDataUrl,
    use_client_tts: tts.useClientTts,
    story_status: status,
  };
}
