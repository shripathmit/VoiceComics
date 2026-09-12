import { create } from "zustand";
import type { PanelRender, ProsodyMetrics, StateVector } from "@voicecomics/types";

export type ConnectionStatus = "connecting" | "open" | "closed";
export type TurnPhase = "idle" | "listening" | "thinking" | "speaking" | "ended";

export interface SessionStore {
  connectionStatus: ConnectionStatus;
  sessionId: string | null;
  turnIndex: number;
  turnPhase: TurnPhase;
  currentState: StateVector | null;
  panelRender: PanelRender | null;
  lastProsody: ProsodyMetrics | null;
  errorMessage: string | null;

  setConnectionStatus: (status: ConnectionStatus) => void;
  setSessionStarted: (sessionId: string, currentState: StateVector, panelRender: PanelRender) => void;
  setTurnPhase: (phase: TurnPhase) => void;
  setAsrProsody: (turnIndex: number, prosody: ProsodyMetrics) => void;
  setStateUpdate: (turnIndex: number, currentState: StateVector, panelRender: PanelRender) => void;
  setError: (message: string) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  connectionStatus: "connecting",
  sessionId: null,
  turnIndex: 0,
  turnPhase: "idle",
  currentState: null,
  panelRender: null,
  lastProsody: null,
  errorMessage: null,

  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setSessionStarted: (sessionId, currentState, panelRender) =>
    set({ sessionId, currentState, panelRender, turnIndex: 0, turnPhase: "idle", errorMessage: null }),
  setTurnPhase: (phase) => set({ turnPhase: phase }),
  setAsrProsody: (turnIndex, prosody) => set({ turnIndex, lastProsody: prosody, turnPhase: "thinking" }),
  setStateUpdate: (turnIndex, currentState, panelRender) =>
    set({
      turnIndex: turnIndex + 1,
      currentState,
      panelRender,
      turnPhase: panelRender.conversation_status === "ongoing" ? "speaking" : "ended",
    }),
  setError: (message) => set({ errorMessage: message, turnPhase: "idle" }),
  reset: () =>
    set({
      sessionId: null,
      turnIndex: 0,
      turnPhase: "idle",
      currentState: null,
      panelRender: null,
      lastProsody: null,
      errorMessage: null,
    }),
}));
