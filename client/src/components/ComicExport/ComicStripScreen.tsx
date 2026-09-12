import { useRef, useState } from "react";
import { useSessionStore } from "../../state/sessionStore";
import { ComicPanel } from "../ComicPanel/ComicPanel";
import { exportComicStripPng, downloadDataUrl } from "../../lib/comicExport";
import { socket } from "../../services/ws/socket";
import { PREMISE_ID } from "../../lib/constants";

export function ComicStripScreen() {
  const storyHistory = useSessionStore((s) => s.storyHistory);
  const resetStory = useSessionStore((s) => s.resetStory);
  const stripRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleDownload = async () => {
    const container = stripRef.current;
    if (!container) return;
    setExporting(true);
    try {
      const svgs = Array.from(container.querySelectorAll("svg"));
      const dataUrl = await exportComicStripPng(svgs, "The Late Shift");
      downloadDataUrl(dataUrl, "voicecomics-strip.png");
    } finally {
      setExporting(false);
    }
  };

  const handleNewStory = () => {
    resetStory();
    socket.send({ event: "start_story", premise_id: PREMISE_ID });
  };

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto pb-2">
      <h2 className="font-sketch text-lg font-bold">Your Comic</h2>

      <div ref={stripRef} className="grid grid-cols-2 gap-2">
        {storyHistory.map((beat, index) => (
          <ComicPanel key={index} panel={beat.panelRender} />
        ))}
      </div>

      <button
        type="button"
        onClick={handleDownload}
        disabled={exporting}
        className="min-h-[52px] rounded-xl border-2 border-neutral-600 bg-neutral-800 px-6 font-semibold active:bg-neutral-700 disabled:opacity-50"
      >
        {exporting ? "Building image…" : "Download comic (PNG)"}
      </button>

      <button
        type="button"
        onClick={handleNewStory}
        className="min-h-[52px] rounded-xl border-2 border-emerald-600 bg-emerald-950 px-6 font-semibold text-emerald-300 active:bg-emerald-900"
      >
        Start a new story
      </button>
    </div>
  );
}
