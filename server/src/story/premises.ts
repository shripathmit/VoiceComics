import type { StoryPremise } from "@voicecomics/types";

export const theLateShift: StoryPremise = {
  premise_id: "the_late_shift",
  title: "The Late Shift",
  opening_narration:
    "It's past midnight and the building is empty except for you. You're finishing up on the lounge couch, laptop balanced on your knees, when a file you don't remember downloading finishes syncing on its own. The cursor blinks. Somewhere down the hall, a door you're sure was locked clicks open.",
  background_asset_id: "bg_dorm_lounge_day",
};

export const PREMISES: Record<string, StoryPremise> = {
  [theLateShift.premise_id]: theLateShift,
};
