import { useCallback, useRef } from "react";
import { useHoldToTalk } from "../../hooks/useHoldToTalk";
import { useSessionStore } from "../../state/sessionStore";

export function HoldToTalkButton() {
  const { isRecording, micPermission, startRecording, stopRecording, cancelRecording } =
    useHoldToTalk();
  const turnPhase = useSessionStore((s) => s.turnPhase);
  const pointerIdRef = useRef<number | null>(null);

  const disabled = turnPhase === "thinking" || turnPhase === "speaking" || turnPhase === "ended";

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      pointerIdRef.current = e.pointerId;
      void startRecording();
    },
    [disabled, startRecording]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (pointerIdRef.current !== e.pointerId) return;
      pointerIdRef.current = null;
      void stopRecording();
    },
    [stopRecording]
  );

  const onPointerCancel = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (pointerIdRef.current !== e.pointerId) return;
      pointerIdRef.current = null;
      cancelRecording();
    },
    [cancelRecording]
  );

  let label = "Hold to speak your move";
  if (micPermission === "denied") label = "Mic blocked — check permissions";
  else if (isRecording) label = "Listening… release to send";
  else if (turnPhase === "thinking") label = "The story is unfolding…";
  else if (turnPhase === "speaking") label = "Narrating…";
  else if (turnPhase === "ended") label = "Story ended";

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerLeave={onPointerCancel}
      style={{ touchAction: "none" }}
      className={`w-full min-h-[88px] rounded-2xl border-2 text-lg font-semibold transition-colors select-none
        ${isRecording ? "bg-red-600 border-red-400 animate-pulse" : "bg-neutral-800 border-neutral-600"}
        ${disabled ? "opacity-50" : "active:bg-neutral-700"}`}
    >
      {label}
    </button>
  );
}
