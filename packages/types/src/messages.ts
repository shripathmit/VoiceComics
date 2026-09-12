import { z } from "zod";
import { StoryStatusSchema, EndingMoodSchema } from "./state.js";

/* ---------- Client -> Server ---------- */

export const AudioPayloadSchema = z.object({
  format: z.literal("audio/webm;codecs=opus"),
  data: z.string(), // base64
});

export const ClientVoiceTurnSchema = z.object({
  event: z.literal("user_voice_turn"),
  session_id: z.string(),
  turn_index: z.number().int().min(0),
  mode: z.enum(["audio", "text"]),
  audio_payload: AudioPayloadSchema.optional(),
  text_payload: z.string().optional(),
});
export type ClientVoiceTurn = z.infer<typeof ClientVoiceTurnSchema>;

export const ClientStartStorySchema = z.object({
  event: z.literal("start_story"),
  premise_id: z.string().default("the_late_shift"),
});
export type ClientStartStory = z.infer<typeof ClientStartStorySchema>;

export const ClientMessageSchema = z.discriminatedUnion("event", [
  ClientVoiceTurnSchema,
  ClientStartStorySchema,
]);
export type ClientMessage = z.infer<typeof ClientMessageSchema>;

/* ---------- Server -> Client ---------- */

export const ProsodyMetricsSchema = z.object({
  speech_rate_wpm: z.number(),
  filler_word_count: z.number().int(),
  initiation_latency_ms: z.number(),
  energy_classification: z.enum([
    "low_hesitant",
    "moderate_calm",
    "high_confident",
    "high_aggressive",
  ]),
  confidence_score: z.number().min(0).max(1),
});
export type ProsodyMetrics = z.infer<typeof ProsodyMetricsSchema>;

export const AsrProsodyEventSchema = z.object({
  event: z.literal("asr_prosody"),
  session_id: z.string(),
  turn_index: z.number().int(),
  transcription: z.string(),
  prosody_metrics: ProsodyMetricsSchema,
});
export type AsrProsodyEvent = z.infer<typeof AsrProsodyEventSchema>;

export const SpritePoseSchema = z.enum([
  "SPRITE_NEUTRAL",
  "SPRITE_LEANING_IN",
  "SPRITE_CROSSED_ARMS",
  "SPRITE_STEP_BACK",
]);
export type SpritePose = z.infer<typeof SpritePoseSchema>;

export const FacialExpressionSchema = z.enum([
  "EXPR_SUBTLE_SMILE",
  "EXPR_NEUTRAL",
  "EXPR_SKEPTICAL",
  "EXPR_ANNOYED",
  "EXPR_SURPRISED",
]);
export type FacialExpression = z.infer<typeof FacialExpressionSchema>;

export const VisualFxSchema = z.object({
  type: z.enum(["ACTION_LINES", "SWEAT_DROP", "SPARKLE"]),
  position: z.enum(["top_right", "top_left", "center", "above_head"]),
});
export type VisualFx = z.infer<typeof VisualFxSchema>;

export const SpeechBubbleSchema = z.object({
  speaker: z.string(),
  text: z.string(),
  bubble_type: z.enum(["STANDARD_ROUND", "SHARP_ANNOYED", "HESITANT_WAVY", "CAPTION_BOX"]),
  tail_anchor: z.object({ x: z.number(), y: z.number() }),
});
export type SpeechBubble = z.infer<typeof SpeechBubbleSchema>;

export const PanelRenderSchema = z.object({
  panel_id: z.string(),
  background_asset_id: z.string(),
  character_rig: z.object({
    character_id: z.string(),
    sprite_pose: SpritePoseSchema,
    facial_expression: FacialExpressionSchema,
  }),
  visual_fx: z.array(VisualFxSchema),
  speech_bubble: SpeechBubbleSchema,
  audio_stream_url: z.string().nullable(),
  use_client_tts: z.boolean(),
  story_status: StoryStatusSchema,
});
export type PanelRender = z.infer<typeof PanelRenderSchema>;

export const StoryBeatEventSchema = z.object({
  event: z.literal("story_beat"),
  session_id: z.string(),
  beat_index: z.number().int(),
  panel_render: PanelRenderSchema,
  story_status: StoryStatusSchema,
  ending_mood: EndingMoodSchema.nullable(),
});
export type StoryBeatEvent = z.infer<typeof StoryBeatEventSchema>;

export const StoryStartedEventSchema = z.object({
  event: z.literal("story_started"),
  session_id: z.string(),
  panel_render: PanelRenderSchema,
});
export type StoryStartedEvent = z.infer<typeof StoryStartedEventSchema>;

export const ErrorEventSchema = z.object({
  event: z.literal("error"),
  session_id: z.string().optional(),
  message: z.string(),
});
export type ErrorEvent = z.infer<typeof ErrorEventSchema>;

export const ServerMessageSchema = z.discriminatedUnion("event", [
  AsrProsodyEventSchema,
  StoryBeatEventSchema,
  StoryStartedEventSchema,
  ErrorEventSchema,
]);
export type ServerMessage = z.infer<typeof ServerMessageSchema>;

/* ---------- LLM orchestrator structured output ---------- */

export const StoryOrchestratorOutputSchema = z.object({
  narration: z.string(),
  dialogue: z.object({ speaker: z.string(), text: z.string() }).nullable(),
  sprite_pose: SpritePoseSchema,
  facial_expression: FacialExpressionSchema,
  visual_fx: z.array(VisualFxSchema),
  bubble_type: SpeechBubbleSchema.shape.bubble_type,
  story_status: StoryStatusSchema,
  ending_mood: EndingMoodSchema.nullable(),
});
export type StoryOrchestratorOutput = z.infer<typeof StoryOrchestratorOutputSchema>;
