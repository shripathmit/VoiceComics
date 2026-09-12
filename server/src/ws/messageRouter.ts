import { ClientMessageSchema, type ClientMessage, type ServerMessage } from "@voicecomics/types";
import { createSession, getSession } from "../session/sessionStore.js";
import { PREMISES, theLateShift } from "../story/premises.js";
import { providers } from "../config/providers.js";
import { extractProsody } from "../prosody/extractProsody.js";
import { continueStory } from "../orchestrator/orchestrator.js";
import { buildPanelRender } from "../compositor/panelSelector.js";

type Send = (msg: ServerMessage) => void;

export async function handleClientMessage(raw: unknown, send: Send): Promise<void> {
  const parsed = ClientMessageSchema.safeParse(raw);
  if (!parsed.success) {
    send({ event: "error", message: `Invalid message: ${parsed.error.message}` });
    return;
  }
  const message: ClientMessage = parsed.data;

  if (message.event === "start_story") {
    const premise = PREMISES[message.premise_id] ?? theLateShift;
    const session = createSession(premise);
    session.history.push({ narration: premise.opening_narration, playerAction: null });

    const tts = await providers.tts.synthesize(premise.opening_narration);

    send({
      event: "story_started",
      session_id: session.sessionId,
      panel_render: {
        panel_id: "p_intro",
        background_asset_id: premise.background_asset_id,
        character_rig: {
          character_id: premise.premise_id,
          sprite_pose: "SPRITE_NEUTRAL",
          facial_expression: "EXPR_NEUTRAL",
        },
        visual_fx: [],
        speech_bubble: {
          speaker: "",
          text: premise.opening_narration,
          bubble_type: "CAPTION_BOX",
          tail_anchor: { x: 0.62, y: 0.38 },
        },
        audio_stream_url: tts.audioDataUrl,
        use_client_tts: tts.useClientTts,
        story_status: "ongoing",
      },
    });
    return;
  }

  // event === "user_voice_turn"
  const session = getSession(message.session_id);
  if (!session) {
    send({ event: "error", session_id: message.session_id, message: "Unknown session_id — start a new story." });
    return;
  }
  if (session.storyStatus !== "ongoing") {
    send({
      event: "error",
      session_id: session.sessionId,
      message: "This story has already ended — start a new one.",
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
    turn_index: session.beatIndex,
    transcription: transcribeResult.transcription,
    prosody_metrics: prosody,
  });

  const output = await continueStory(providers.llm, session, transcribeResult.transcription, prosody);

  session.history.push({ narration: output.narration, playerAction: transcribeResult.transcription });
  session.storyStatus = output.story_status;
  session.lastTurnAt = Date.now();

  const tts = await providers.tts.synthesize(output.dialogue?.text ?? output.narration);
  const panelRender = buildPanelRender(session, output, tts, session.storyStatus);

  send({
    event: "story_beat",
    session_id: session.sessionId,
    beat_index: session.beatIndex,
    panel_render: panelRender,
    story_status: session.storyStatus,
    ending_mood: output.ending_mood,
  });

  session.beatIndex += 1;
}
