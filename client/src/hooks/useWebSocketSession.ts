import { useEffect } from "react";
import { socket } from "../services/ws/socket";
import { useSessionStore } from "../state/sessionStore";
import { playAudioDataUrl, speakWithWebSpeech } from "../services/tts/webSpeechFallback";
import { PREMISE_ID } from "../lib/constants";

export function useWebSocketSession() {
  const store = useSessionStore();

  useEffect(() => {
    const unsubStatus = socket.onStatusChange((status) => {
      useSessionStore.getState().setConnectionStatus(status);
      // Only auto-start on the very first connection. A later reconnect (a
      // dev-server blip, a flaky mobile network) must NOT silently discard
      // an in-progress story — the existing session_id is still good on the
      // server unless it actually restarted, and the "Unknown session_id"
      // error path already tells the player to start over in that case.
      if (status === "open" && !useSessionStore.getState().sessionId) {
        socket.send({ event: "start_story", premise_id: PREMISE_ID });
      }
    });

    const unsubMessage = socket.onMessage((msg) => {
      const s = useSessionStore.getState();
      switch (msg.event) {
        case "story_started": {
          s.setStoryStarted(msg.session_id, msg.panel_render);
          const bubble = msg.panel_render.speech_bubble;
          if (msg.panel_render.use_client_tts) {
            speakWithWebSpeech(bubble.text);
          } else if (msg.panel_render.audio_stream_url) {
            playAudioDataUrl(msg.panel_render.audio_stream_url);
          }
          break;
        }
        case "asr_prosody":
          s.setAsrProsody(msg.turn_index, msg.prosody_metrics);
          break;
        case "story_beat": {
          s.setStoryBeat(msg.beat_index, msg.panel_render, msg.ending_mood);

          const bubble = msg.panel_render.speech_bubble;
          const storyStatus = msg.panel_render.story_status;
          const finishSpeaking = () =>
            useSessionStore.getState().setTurnPhase(storyStatus === "ongoing" ? "idle" : "ended");

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
