import type { ConversationStatus, PanelRender, ProsodyMetrics, SystemRead } from "@voicecomics/types";

export interface TurnLogEntry {
  rapport_delta: number;
  patience_delta: number;
  comfort_delta: number;
  prosody: ProsodyMetrics;
  tone: SystemRead["tone"];
  intention: SystemRead["intention"];
}

export interface RunGrades {
  readTheRoomGrade: string;
  toneConsistencyGrade: string;
  readTheRoomScore: number;
  toneConsistencyScore: number;
  overallScore: number;
}

export interface RunSummary {
  runNumber: number;
  outcome: ConversationStatus;
  grades: RunGrades;
  turnLog: TurnLogEntry[];
  panelRender: PanelRender;
}

export interface Badge {
  id: string;
  label: string;
  emoji: string;
}
