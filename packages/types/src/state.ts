import { z } from "zod";

export const StoryStatusSchema = z.enum(["ongoing", "ended"]);
export type StoryStatus = z.infer<typeof StoryStatusSchema>;

export const EndingMoodSchema = z.enum(["triumphant", "bittersweet", "ominous", "peaceful"]);
export type EndingMood = z.infer<typeof EndingMoodSchema>;
