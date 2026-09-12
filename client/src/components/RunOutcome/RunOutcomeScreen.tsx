import { useSessionStore } from "../../state/sessionStore";
import { socket } from "../../services/ws/socket";
import { CHARACTER_ID } from "../../lib/constants";

const OUTCOME_COPY: Record<string, { title: string; tone: string }> = {
  success: { title: "Nice — you built real rapport.", tone: "text-emerald-400" },
  soft_disengage: { title: "Alex politely wrapped it up.", tone: "text-amber-300" },
  hard_rejection: { title: "That landed badly. Alex shut it down.", tone: "text-red-400" },
  time_expired: { title: "Time's up — you two covered a lot of ground.", tone: "text-neutral-300" },
};

export function RunOutcomeScreen() {
  const runHistory = useSessionStore((s) => s.runHistory);
  const startNewRun = useSessionStore((s) => s.startNewRun);
  const setView = useSessionStore((s) => s.setView);
  const lastRun = runHistory[runHistory.length - 1];

  if (!lastRun) return null;
  const outcome = OUTCOME_COPY[lastRun.outcome] ?? OUTCOME_COPY.time_expired;

  const handleRetry = () => {
    startNewRun();
    socket.send({ event: "start_session", character_id: CHARACTER_ID });
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-2 text-center">
      <p className={`text-lg font-semibold ${outcome.tone}`}>{outcome.title}</p>

      <div className="grid w-full max-w-xs grid-cols-2 gap-3">
        <div className="rounded-xl border-2 border-neutral-700 bg-neutral-900 px-3 py-3">
          <p className="text-[11px] uppercase tracking-wide text-neutral-400">Read the Room</p>
          <p className="text-2xl font-bold">{lastRun.grades.readTheRoomGrade}</p>
        </div>
        <div className="rounded-xl border-2 border-neutral-700 bg-neutral-900 px-3 py-3">
          <p className="text-[11px] uppercase tracking-wide text-neutral-400">Tone Consistency</p>
          <p className="text-2xl font-bold">{lastRun.grades.toneConsistencyGrade}</p>
        </div>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-2">
        <button
          type="button"
          onClick={handleRetry}
          className="min-h-[52px] rounded-xl border-2 border-neutral-600 bg-neutral-800 px-6 font-semibold active:bg-neutral-700"
        >
          Run it again
        </button>
        <button
          type="button"
          onClick={() => setView("debrief")}
          className="min-h-[52px] rounded-xl border-2 border-emerald-600 bg-emerald-950 px-6 font-semibold text-emerald-300 active:bg-emerald-900"
        >
          Finish &amp; see my progress
        </button>
      </div>
    </div>
  );
}
