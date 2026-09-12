import { create } from "zustand";
import type { EndingMood, PanelRender, ProsodyMetrics } from "@voicecomics/types";

export type ConnectionStatus = "connecting" | "open" | "closed";
export type TurnPhase = "idle" | "listening" | "thinking" | "speaking" | "ended";
export type View = "story" | "ending" | "comic";

export interface StoryBeatSnapshot {
  beatIndex: number;
  panelRender: PanelRender;
}

export interface SessionStore {
  connectionStatus: ConnectionStatus;
  sessionId: string | null;
  beatIndex: number;
  turnPhase: TurnPhase;
  panelRender: PanelRender | null;
  lastProsody: ProsodyMetrics | null;
  errorMessage: string | null;

  view: View;
  storyHistory: StoryBeatSnapshot[];
  endingMood: EndingMood | null;

  setConnectionStatus: (status: ConnectionStatus) => void;
  setStoryStarted: (sessionId: string, panelRender: PanelRender) => void;
  setTurnPhase: (phase: TurnPhase) => void;
  setAsrProsody: (beatIndex: number, prosody: ProsodyMetrics) => void;
  setStoryBeat: (beatIndex: number, panelRender: PanelRender, endingMood: EndingMood | null) => void;
  setView: (view: View) => void;
  setError: (message: string) => void;
  resetStory: () => void;
}

const STORY_SCOPED_DEFAULTS = {
  sessionId: null as string | null,
  beatIndex: 0,
  turnPhase: "idle" as TurnPhase,
  panelRender: null as PanelRender | null,
  lastProsody: null as ProsodyMetrics | null,
  errorMessage: null as string | null,
  storyHistory: [] as StoryBeatSnapshot[],
  endingMood: null as EndingMood | null,
  view: "story" as View,
};

export const useSessionStore = create<SessionStore>((set) => ({
  connectionStatus: "connecting",
  ...STORY_SCOPED_DEFAULTS,

  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setStoryStarted: (sessionId, panelRender) =>
    set({
      sessionId,
      panelRender,
      beatIndex: 0,
      turnPhase: "idle",
      errorMessage: null,
      storyHistory: [{ beatIndex: 0, panelRender }],
    }),
  setTurnPhase: (phase) => set({ turnPhase: phase }),
  setAsrProsody: (beatIndex, prosody) => set({ beatIndex, lastProsody: prosody, turnPhase: "thinking" }),
  setStoryBeat: (beatIndex, panelRender, endingMood) =>
    set((s) => ({
      beatIndex: beatIndex + 1,
      panelRender,
      endingMood,
      turnPhase: panelRender.story_status === "ongoing" ? "speaking" : "ended",
      storyHistory: [...s.storyHistory, { beatIndex, panelRender }],
      view: panelRender.story_status === "ongoing" ? s.view : "ending",
    })),
  setView: (view) => set({ view }),
  setError: (message) => set({ errorMessage: message, turnPhase: "idle" }),
  resetStory: () => set({ ...STORY_SCOPED_DEFAULTS }),
}));
