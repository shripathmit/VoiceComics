import { ComicPanel } from "./ComicPanel/ComicPanel";
import { StateBars } from "./StatusHud/StateBars";
import { HoldToTalkButton } from "./MicButton/HoldToTalkButton";
import { TextTurnForm } from "./MicButton/TextTurnForm";
import { VibeAnalyzerCard } from "./VibeAnalyzer/VibeAnalyzerCard";
import { DeltaToast } from "./StatusHud/DeltaToast";
import { useSessionStore } from "../state/sessionStore";
import type { ProviderStatus } from "../hooks/useProviderStatus";

export function RunView({ providers }: { providers: ProviderStatus | null }) {
  const sessionId = useSessionStore((s) => s.sessionId);
  const currentState = useSessionStore((s) => s.currentState);
  const panelRender = useSessionStore((s) => s.panelRender);
  const errorMessage = useSessionStore((s) => s.errorMessage);
  const turnPhase = useSessionStore((s) => s.turnPhase);
  const useLiveMic = providers?.stt !== "mock";

  return (
    <>
      <StateBars state={currentState} />

      <div className="relative flex-1 min-h-0">
        <ComicPanel panel={panelRender} />
        <VibeAnalyzerCard />
        <DeltaToast />
      </div>

      {errorMessage && (
        <p className="rounded-lg bg-red-950 px-3 py-2 text-sm text-red-300">{errorMessage}</p>
      )}

      <div className="pb-1">
        {!sessionId ? (
          <p className="text-center text-sm text-neutral-400">Connecting to Alex…</p>
        ) : useLiveMic ? (
          <HoldToTalkButton />
        ) : (
          <TextTurnForm />
        )}
        {turnPhase === "listening" && (
          <p className="mt-1 text-center text-xs text-neutral-500">Release to send</p>
        )}
      </div>
    </>
  );
}
