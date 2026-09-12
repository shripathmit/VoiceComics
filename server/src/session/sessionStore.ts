import { randomUUID } from "node:crypto";
import type { StoryPremise } from "@voicecomics/types";
import type { SessionState } from "./types.js";

const sessions = new Map<string, SessionState>();

export function createSession(premise: StoryPremise): SessionState {
  const session: SessionState = {
    sessionId: `sess_${randomUUID().slice(0, 12)}`,
    premise,
    storyStatus: "ongoing",
    beatIndex: 0,
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
