import { randomUUID } from "node:crypto";
import { DEFAULT_STATE, type CharacterDefinition } from "@voicecomics/types";
import type { SessionState } from "./types.js";

const sessions = new Map<string, SessionState>();

export function createSession(character: CharacterDefinition): SessionState {
  const session: SessionState = {
    sessionId: `sess_${randomUUID().slice(0, 12)}`,
    character,
    state: { ...DEFAULT_STATE },
    status: "ongoing",
    turnIndex: 0,
    history: [],
    lastTurnAt: Date.now(),
    createdAt: Date.now(),
  };
  sessions.set(session.sessionId, session);
  return session;
}

export function getSession(sessionId: string): SessionState | undefined {
  return sessions.get(sessionId);
}

export function deleteSession(sessionId: string): void {
  sessions.delete(sessionId);
}
