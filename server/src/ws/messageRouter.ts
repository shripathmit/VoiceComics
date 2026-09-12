import {
  ClientMessageSchema,
  type ClientMessage,
  type ServerMessage,
} from "@voicecomics/types";
import { createSession, getSession } from "../session/sessionStore.js";
import { CHARACTERS, dormLoungeAlex } from "../orchestrator/characters/defaultCharacter.js";
import { providers } from "../config/providers.js";
import { extractProsody } from "../prosody/extractProsody.js";
import { evaluateTurn } from "../orchestrator/orchestrator.js";
import { applyDeltas, checkTerminationWithCap } from "../state/stateMachine.js";
import { buildPanelRender } from "../compositor/panelSelector.js";

type Send = (msg: ServerMessage) => void;

export async function handleClientMessage(raw: unknown, send: Send): Promise<void> {
  const parsed = ClientMessageSchema.safeParse(raw);
  if (!parsed.success) {
    send({ event: "error", message: `Invalid message: ${parsed.error.message}` });
    return;
  }
  const message: ClientMessage = parsed.data;

  if (message.event === "start_session") {
    const character = CHARACTERS[message.character_id] ?? dormLoungeAlex;
    const session = createSession(character);
    send({
      event: "session_started",
      session_id: session.sessionId,
      current_state: session.state,
      panel_render: {
        panel_id: "p_00",
        background_asset_id: character.background_asset_id,
        character_rig: {
          character_id: character.character_id,
          sprite_pose: "SPRITE_NEUTRAL",
          facial_expression: "EXPR_NEUTRAL",
        },
        visual_fx: [],
        speech_bubble: {
          speaker: character.name,
          text: "(headphones half-on, working on a laptop)",
          bubble_type: "STANDARD_ROUND",
          tail_anchor: { x: 0.62, y: 0.38 },
        },
        audio_stream_url: null,
        use_client_tts: false,
        conversation_status: "ongoing",
      },
    });
    return;
  }

  // event === "user_voice_turn"
  const session = getSession(message.session_id);
  if (!session) {
    send({ event: "error", session_id: message.session_id, message: "Unknown session_id — start a new session." });
    return;
  }
  if (session.status !== "ongoing") {
    send({
      event: "error",
      session_id: session.sessionId,
      message: `Session already ended (${session.status}) — start a new session.`,
    });
    return;
  }

  const turnStartedAt = Date.now();
  const initiationLatencyMs = turnStartedAt - session.lastTurnAt;

  const transcribeResult = await providers.stt.transcribe({
    mode: message.mode,
    audioBase64: message.audio_payload?.data,
    audioFormat: message.audio_payload?.format,
    text: message.text_payload,
  });

  const prosody = extractProsody({ transcribeResult, initiationLatencyMs });

  send({
    event: "asr_prosody",
    session_id: session.sessionId,
    turn_index: session.turnIndex,
    transcription: transcribeResult.transcription,
    prosody_metrics: prosody,
  });

  session.history.push({ speaker: "user", text: transcribeResult.transcription });

  const output = await evaluateTurn(providers.llm, session, transcribeResult.transcription, prosody);

  session.state = applyDeltas(session.state, {
    rapport_delta: output.rapport_delta,
    patience_delta: output.patience_delta,
    comfort_delta: output.comfort_delta,
  });
  session.status = checkTerminationWithCap(session.state, output.boundary_violation, session.turnIndex + 1);
  session.history.push({ speaker: "character", text: output.dialogue });
  session.lastTurnAt = Date.now();

  const tts = await providers.tts.synthesize(output.dialogue);
  const panelRender = buildPanelRender(session, output, tts, session.status);

  send({
    event: "state_update",
    session_id: session.sessionId,
    turn_index: session.turnIndex,
    state_updates: {
      rapport_delta: output.rapport_delta,
      patience_delta: output.patience_delta,
      comfort_delta: output.comfort_delta,
    },
    current_state: session.state,
    panel_render: panelRender,
    system_read: { tone: output.detected_tone, intention: output.detected_intention },
  });

  session.turnIndex += 1;
}
