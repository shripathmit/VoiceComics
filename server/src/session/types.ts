import type { StoryPremise, StoryStatus } from "@voicecomics/types";

export interface StoryBeatRecord {
  narration: string;
  playerAction: string | null;
}

export interface SessionState {
  sessionId: string;
  premise: StoryPremise;
  storyStatus: StoryStatus;
  beatIndex: number;
  history: StoryBeatRecord[];
  lastTurnAt: number;
  createdAt: number;
}
