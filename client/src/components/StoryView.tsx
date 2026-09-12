import { ComicPanel } from "./ComicPanel/ComicPanel";
import { HoldToTalkButton } from "./MicButton/HoldToTalkButton";
import { TextTurnForm } from "./MicButton/TextTurnForm";
import { useSessionStore } from "../state/sessionStore";
import type { ProviderStatus } from "../hooks/useProviderStatus";

export function StoryView({ providers }: { providers: ProviderStatus | null }) {
  const sessionId = useSessionStore((s) => s.sessionId);
  const panelRender = useSessionStore((s) => s.panelRender);
  const errorMessage = useSessionStore((s) => s.errorMessage);
  const turnPhase = useSessionStore((s) => s.turnPhase);
  const useLiveMic = providers?.stt !== "mock";

  return (
    <>
      <div className="flex-1 min-h-0">
        <ComicPanel panel={panelRender} />
      </div>

      {errorMessage && (
        <p className="rounded-lg bg-red-950 px-3 py-2 text-sm text-red-300">{errorMessage}</p>
      )}

      <div className="pb-1">
        <p className="mb-2 text-center text-sm text-neutral-400">
          {!sessionId ? "Connecting…" : "What do you do?"}
        </p>
        {!sessionId ? null : useLiveMic ? <HoldToTalkButton /> : <TextTurnForm />}
        {turnPhase === "listening" && (
          <p className="mt-1 text-center text-xs text-neutral-500">Release to send</p>
        )}
      </div>
    </>
  );
}
