import { z } from "zod";

export const CharacterPersonalitySchema = z.object({
  introversion: z.number().min(0).max(1),
  wit: z.number().min(0).max(1),
  guardedness: z.number().min(0).max(1),
  interruption_tolerance: z.enum(["low", "medium", "high"]),
});
export type CharacterPersonality = z.infer<typeof CharacterPersonalitySchema>;

export const CharacterDefinitionSchema = z.object({
  character_id: z.string(),
  name: z.string(),
  scenario: z.string(),
  context: z.string(),
  personality: CharacterPersonalitySchema,
  background_asset_id: z.string(),
});
export type CharacterDefinition = z.infer<typeof CharacterDefinitionSchema>;
