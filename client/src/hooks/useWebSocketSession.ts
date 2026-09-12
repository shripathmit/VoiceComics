import { useEffect, useRef } from "react";
import { socket } from "../services/ws/socket";
import { useSessionStore } from "../state/sessionStore";
import { playAudioDataUrl, speakWithWebSpeech } from "../services/tts/webSpeechFallback";

const CHARACTER_ID = "alex_dorm_lounge";

export function useWebSocketSession() {
  const store = useSessionStore();
  const startedRef = useRef(false);

  useEffect(() => {
    const unsubStatus = socket.onStatusChange((status) => {
      useSessionStore.getState().setConnectionStatus(status);
      if (status === "open" && !startedRef.current) {
        startedRef.current = true;
        socket.send({ event: "start_session", character_id: CHARACTER_ID });
      }
      if (status === "closed") {
        startedRef.current = false;
      }
    });

    const unsubMessage = socket.onMessage((msg) => {
      const s = useSessionStore.getState();
      switch (msg.event) {
        case "session_started":
          s.setSessionStarted(msg.session_id, msg.current_state, msg.panel_render);
          break;
        case "asr_prosody":
          s.setAsrProsody(msg.turn_index, msg.prosody_metrics);
          break;
        case "state_update": {
          s.setStateUpdate(msg.turn_index, msg.current_state, msg.panel_render);
          const bubble = msg.panel_render.speech_bubble;
          const finishSpeaking = () => useSessionStore.getState().setTurnPhase(
            msg.panel_render.conversation_status === "ongoing" ? "idle" : "ended"
          );
          if (msg.panel_render.use_client_tts) {
            speakWithWebSpeech(bubble.text, finishSpeaking);
          } else if (msg.panel_render.audio_stream_url) {
            playAudioDataUrl(msg.panel_render.audio_stream_url, finishSpeaking);
          } else {
            finishSpeaking();
          }
          break;
        }
        case "error":
          s.setError(msg.message);
          break;
      }
    });

    socket.connect();
    return () => {
      unsubStatus();
      unsubMessage();
      socket.disconnect();
    };
  }, []);

  return store;
}
