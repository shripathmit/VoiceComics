import { z } from "zod";

export const StoryPremiseSchema = z.object({
  premise_id: z.string(),
  title: z.string(),
  opening_narration: z.string(),
  background_asset_id: z.string(),
});
export type StoryPremise = z.infer<typeof StoryPremiseSchema>;
