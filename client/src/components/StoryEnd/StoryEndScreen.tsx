import { useSessionStore } from "../../state/sessionStore";
import { ComicPanel } from "../ComicPanel/ComicPanel";
import { socket } from "../../services/ws/socket";
import { PREMISE_ID } from "../../lib/constants";

const MOOD_COPY: Record<string, { title: string; tone: string }> = {
  triumphant: { title: "You made it through.", tone: "text-emerald-400" },
  peaceful: { title: "It ends quietly.", tone: "text-sky-300" },
  bittersweet: { title: "You got your answer — mostly.", tone: "text-amber-300" },
  ominous: { title: "Some things stay unresolved.", tone: "text-red-400" },
};

export function StoryEndScreen() {
  const panelRender = useSessionStore((s) => s.panelRender);
  const endingMood = useSessionStore((s) => s.endingMood);
  const resetStory = useSessionStore((s) => s.resetStory);
  const setView = useSessionStore((s) => s.setView);

  if (!panelRender) return null;
  const mood = MOOD_COPY[endingMood ?? "ominous"] ?? MOOD_COPY.ominous;

  const handleRetry = () => {
    resetStory();
    socket.send({ event: "start_story", premise_id: PREMISE_ID });
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-2 text-center">
      <p className={`text-lg font-semibold ${mood.tone}`}>{mood.title}</p>

      <div className="w-full max-w-xs">
        <ComicPanel panel={panelRender} />
      </div>

      <div className="flex w-full max-w-xs flex-col gap-2">
        <button
          type="button"
          onClick={() => setView("comic")}
          className="min-h-[52px] rounded-xl border-2 border-emerald-600 bg-emerald-950 px-6 font-semibold text-emerald-300 active:bg-emerald-900"
        >
          View my comic
        </button>
        <button
          type="button"
          onClick={handleRetry}
          className="min-h-[52px] rounded-xl border-2 border-neutral-600 bg-neutral-800 px-6 font-semibold active:bg-neutral-700"
        >
          Tell it again
        </button>
      </div>
    </div>
  );
}
