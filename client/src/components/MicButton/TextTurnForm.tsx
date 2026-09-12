import { useState, type FormEvent } from "react";
import { socket } from "../../services/ws/socket";
import { useSessionStore } from "../../state/sessionStore";

export function TextTurnForm() {
  const [value, setValue] = useState("");
  const { sessionId, turnIndex, turnPhase } = useSessionStore();
  const disabled = !sessionId || turnPhase === "thinking" || turnPhase === "speaking" || turnPhase === "ended";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = value.trim();
    if (!text || disabled || !sessionId) return;
    useSessionStore.getState().setTurnPhase("thinking");
    socket.send({
      event: "user_voice_turn",
      session_id: sessionId,
      turn_index: turnIndex,
      mode: "text",
      text_payload: text,
    });
    setValue("");
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder='Try: "Hey, mind if I sit here?"'
        className="min-h-[52px] flex-1 rounded-xl border-2 border-neutral-600 bg-neutral-800 px-4 text-base text-neutral-100 placeholder:text-neutral-500 disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="min-h-[52px] min-w-[88px] rounded-xl border-2 border-neutral-600 bg-neutral-800 px-4 font-semibold active:bg-neutral-700 disabled:opacity-50"
      >
        Say it
      </button>
    </form>
  );
}
