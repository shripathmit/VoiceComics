import type { ConversationStatus, OrchestratorOutput, PanelRender } from "@voicecomics/types";
import type { SessionState } from "../session/types.js";
import type { TtsResult } from "../services/tts/types.js";

export function buildPanelRender(
  session: SessionState,
  output: OrchestratorOutput,
  tts: TtsResult,
  status: ConversationStatus
): PanelRender {
  return {
    panel_id: `p_${String(session.turnIndex).padStart(2, "0")}`,
    background_asset_id: session.character.background_asset_id,
    character_rig: {
      character_id: session.character.character_id,
      sprite_pose: output.sprite_pose,
      facial_expression: output.facial_expression,
    },
    visual_fx: output.visual_fx,
    speech_bubble: {
      speaker: session.character.name,
      text: output.dialogue,
      bubble_type: output.bubble_type,
      tail_anchor: { x: 0.62, y: 0.38 },
    },
    audio_stream_url: tts.audioDataUrl,
    use_client_tts: tts.useClientTts,
    conversation_status: status,
  };
}
