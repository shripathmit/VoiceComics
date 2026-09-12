import { useWebSocketSession } from "./hooks/useWebSocketSession";
import { useProviderStatus } from "./hooks/useProviderStatus";
import { LatencyIndicator } from "./components/StatusHud/LatencyIndicator";
import { StoryView } from "./components/StoryView";
import { StoryEndScreen } from "./components/StoryEnd/StoryEndScreen";
import { ComicStripScreen } from "./components/ComicExport/ComicStripScreen";

function App() {
  const { view } = useWebSocketSession();
  const providers = useProviderStatus();

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

      {view === "story" && <StoryView providers={providers} />}
      {view === "ending" && <StoryEndScreen />}
      {view === "comic" && <ComicStripScreen />}
    </div>
  );
}

export default App;
