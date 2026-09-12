import { create } from "zustand";
import type { PanelRender, ProsodyMetrics, StateDeltas, StateVector, SystemRead } from "@voicecomics/types";
import type { RunSummary, TurnLogEntry } from "../lib/types";
import { computeRunGrades } from "../lib/grading";

export type ConnectionStatus = "connecting" | "open" | "closed";
export type TurnPhase = "idle" | "listening" | "thinking" | "speaking" | "ended";
export type View = "run" | "run_outcome" | "debrief";

export interface SessionStore {
  connectionStatus: ConnectionStatus;
  sessionId: string | null;
  turnIndex: number;
  turnPhase: TurnPhase;
  currentState: StateVector | null;
  panelRender: PanelRender | null;
  lastProsody: ProsodyMetrics | null;
  errorMessage: string | null;

  view: View;
  runNumber: number;
  turnLog: TurnLogEntry[];
  runHistory: RunSummary[];
  lastDeltas: StateDeltas | null;
  lastSystemRead: SystemRead | null;

  setConnectionStatus: (status: ConnectionStatus) => void;
  setSessionStarted: (sessionId: string, currentState: StateVector, panelRender: PanelRender) => void;
  setTurnPhase: (phase: TurnPhase) => void;
  setAsrProsody: (turnIndex: number, prosody: ProsodyMetrics) => void;
  recordTurn: (deltas: StateDeltas, prosody: ProsodyMetrics, systemRead: SystemRead) => void;
  setStateUpdate: (turnIndex: number, currentState: StateVector, panelRender: PanelRender) => void;
  completeRun: () => void;
  startNewRun: () => void;
  setView: (view: View) => void;
  setError: (message: string) => void;
  resetSession: () => void;
}

const RUN_SCOPED_DEFAULTS = {
  sessionId: null as string | null,
  turnIndex: 0,
  turnPhase: "idle" as TurnPhase,
  currentState: null as StateVector | null,
  panelRender: null as PanelRender | null,
  lastProsody: null as ProsodyMetrics | null,
  errorMessage: null as string | null,
  turnLog: [] as TurnLogEntry[],
  lastDeltas: null as StateDeltas | null,
  lastSystemRead: null as SystemRead | null,
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  connectionStatus: "connecting",
  ...RUN_SCOPED_DEFAULTS,

  view: "run",
  runNumber: 1,
  runHistory: [],

  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setSessionStarted: (sessionId, currentState, panelRender) =>
    set({ sessionId, currentState, panelRender, turnIndex: 0, turnPhase: "idle", errorMessage: null }),
  setTurnPhase: (phase) => set({ turnPhase: phase }),
  setAsrProsody: (turnIndex, prosody) => set({ turnIndex, lastProsody: prosody, turnPhase: "thinking" }),
  recordTurn: (deltas, prosody, systemRead) =>
    set((s) => ({
      turnLog: [
        ...s.turnLog,
        {
          rapport_delta: deltas.rapport_delta,
          patience_delta: deltas.patience_delta,
          comfort_delta: deltas.comfort_delta,
          prosody,
          tone: systemRead.tone,
          intention: systemRead.intention,
        },
      ],
      lastDeltas: deltas,
      lastSystemRead: systemRead,
    })),
  setStateUpdate: (turnIndex, currentState, panelRender) =>
    set({
      turnIndex: turnIndex + 1,
      currentState,
      panelRender,
      turnPhase: panelRender.conversation_status === "ongoing" ? "speaking" : "ended",
    }),
  completeRun: () => {
    const s = get();
    if (!s.panelRender || s.panelRender.conversation_status === "ongoing") return;
    const summary: RunSummary = {
      runNumber: s.runNumber,
      outcome: s.panelRender.conversation_status,
      grades: computeRunGrades(s.turnLog),
      turnLog: s.turnLog,
      panelRender: s.panelRender,
    };
    set({ runHistory: [...s.runHistory, summary], view: "run_outcome" });
  },
  startNewRun: () =>
    set((s) => ({
      ...RUN_SCOPED_DEFAULTS,
      connectionStatus: s.connectionStatus,
      runNumber: s.runNumber + 1,
      runHistory: s.runHistory,
      view: "run",
    })),
  setView: (view) => set({ view }),
  setError: (message) => set({ errorMessage: message, turnPhase: "idle" }),
  resetSession: () =>
    set((s) => ({
      ...RUN_SCOPED_DEFAULTS,
      connectionStatus: s.connectionStatus,
      view: "run",
      runNumber: 1,
      runHistory: [],
    })),
}));
