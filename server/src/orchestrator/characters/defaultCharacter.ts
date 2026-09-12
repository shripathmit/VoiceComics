import type { CharacterDefinition } from "@voicecomics/types";

export const dormLoungeAlex: CharacterDefinition = {
  character_id: "alex_dorm_lounge",
  name: "Alex",
  scenario:
    "Alex is sitting in a communal dorm lounge, working on a laptop with headphones half-on, when the user approaches to sit down nearby.",
  context:
    "Alex is working on a problem set and didn't expect company, but isn't opposed to a study break if the conversation is easy.",
  personality: {
    introversion: 0.7,
    wit: 0.6,
    guardedness: 0.75,
    interruption_tolerance: "low",
  },
  background_asset_id: "bg_dorm_lounge_day",
};

export const CHARACTERS: Record<string, CharacterDefinition> = {
  [dormLoungeAlex.character_id]: dormLoungeAlex,
};
