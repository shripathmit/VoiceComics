import { z } from "zod";

export const StateVectorSchema = z.object({
  rapport_score: z.number().min(0).max(100),
  patience_level: z.number().min(0).max(100),
  comfort_level: z.number().min(0).max(100),
});
export type StateVector = z.infer<typeof StateVectorSchema>;

export const StateDeltasSchema = z.object({
  rapport_delta: z.number().min(-30).max(20),
  patience_delta: z.number().min(-30).max(10),
  comfort_delta: z.number().min(-20).max(20),
});
export type StateDeltas = z.infer<typeof StateDeltasSchema>;

export const ConversationStatusSchema = z.enum([
  "ongoing",
  "success",
  "soft_disengage",
  "hard_rejection",
]);
export type ConversationStatus = z.infer<typeof ConversationStatusSchema>;

export const DEFAULT_STATE: StateVector = {
  rapport_score: 40,
  patience_level: 60,
  comfort_level: 35,
};
