import { useWebSocketSession } from "./hooks/useWebSocketSession";
import { useProviderStatus } from "./hooks/useProviderStatus";
import { ComicPanel } from "./components/ComicPanel/ComicPanel";
import { StateBars } from "./components/StatusHud/StateBars";
import { LatencyIndicator } from "./components/StatusHud/LatencyIndicator";
import { HoldToTalkButton } from "./components/MicButton/HoldToTalkButton";
import { TextTurnForm } from "./components/MicButton/TextTurnForm";
import { socket } from "./services/ws/socket";
import { useSessionStore } from "./state/sessionStore";

const OUTCOME_COPY: Record<string, { title: string; tone: string }> = {
  success: { title: "Nice — you built real rapport.", tone: "text-emerald-400" },
  soft_disengage: { title: "Alex politely wrapped it up.", tone: "text-amber-300" },
  hard_rejection: { title: "That landed badly. Alex shut it down.", tone: "text-red-400" },
};

function App() {
  const { sessionId, turnPhase, currentState, panelRender, errorMessage } = useWebSocketSession();
  const providers = useProviderStatus();
  const useLiveMic = providers?.stt !== "mock";

  const status = panelRender?.conversation_status;
  const outcome = status && status !== "ongoing" ? OUTCOME_COPY[status] : null;

  const handleRestart = () => {
    useSessionStore.getState().reset();
    socket.send({ event: "start_session", character_id: "alex_dorm_lounge" });
  };

  return (
    <div
      className="mx-auto flex h-dvh max-w-md flex-col gap-3 px-3"
      style={{
        paddingTop: "max(env(safe-area-inset-top), 12px)",
        paddingBottom: "max(env(safe-area-inset-bottom), 12px)",
      }}
    >
      <header className="flex items-center justify-between">
        <h1 className="font-sketch text-xl font-bold tracking-tight">VoiceComics</h1>
        <LatencyIndicator />
      </header>

      <StateBars state={currentState} />

      <div className="flex-1 min-h-0">
        <ComicPanel panel={panelRender} />
      </div>

      {errorMessage && (
        <p className="rounded-lg bg-red-950 px-3 py-2 text-sm text-red-300">{errorMessage}</p>
      )}

      {outcome ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-neutral-700 bg-neutral-900 px-4 py-3 text-center">
          <p className={`font-semibold ${outcome.tone}`}>{outcome.title}</p>
          <button
            type="button"
            onClick={handleRestart}
            className="min-h-[44px] rounded-xl border-2 border-neutral-600 bg-neutral-800 px-6 font-semibold active:bg-neutral-700"
          >
            Start a new run
          </button>
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default App;
