import type { CharacterDefinition, ConversationStatus, StateVector } from "@voicecomics/types";
import type { TurnRecord } from "../services/llm/types.js";

export interface SessionState {
  sessionId: string;
  character: CharacterDefinition;
  state: StateVector;
  status: ConversationStatus;
  turnIndex: number;
  history: TurnRecord[];
  lastTurnAt: number;
  createdAt: number;
}
