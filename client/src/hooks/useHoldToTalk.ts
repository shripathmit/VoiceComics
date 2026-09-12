import { useCallback, useRef, useState } from "react";
import { AudioTurnRecorder } from "../services/audio/recorder";
import { socket } from "../services/ws/socket";
import { useSessionStore } from "../state/sessionStore";

export type MicPermissionState = "idle" | "requesting" | "granted" | "denied";

export function useHoldToTalk() {
  const recorderRef = useRef<AudioTurnRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [micPermission, setMicPermission] = useState<MicPermissionState>("idle");

  const startRecording = useCallback(async () => {
    const { sessionId, turnPhase } = useSessionStore.getState();
    if (!sessionId || turnPhase !== "idle") return;

    setMicPermission("requesting");
    try {
      const recorder = new AudioTurnRecorder();
      await recorder.start();
      recorderRef.current = recorder;
      setMicPermission("granted");
      setIsRecording(true);
      useSessionStore.getState().setTurnPhase("listening");
    } catch {
      setMicPermission("denied");
    }
  }, []);

  const stopRecording = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder || !isRecording) return;
    setIsRecording(false);
    recorderRef.current = null;

    const { sessionId, beatIndex } = useSessionStore.getState();
    if (!sessionId) return;

    try {
      const { base64, format } = await recorder.stop();
      useSessionStore.getState().setTurnPhase("thinking");
      socket.send({
        event: "user_voice_turn",
        session_id: sessionId,
        turn_index: beatIndex,
        mode: "audio",
        audio_payload: { format: format as "audio/webm;codecs=opus", data: base64 },
      });
    } catch {
      useSessionStore.getState().setError("Couldn't process that recording — try again.");
    }
  }, [isRecording]);

  const cancelRecording = useCallback(() => {
    recorderRef.current?.cancel();
    recorderRef.current = null;
    setIsRecording(false);
    useSessionStore.getState().setTurnPhase("idle");
  }, []);

  return { isRecording, micPermission, startRecording, stopRecording, cancelRecording };
}
