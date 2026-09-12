import { z } from "zod";
import { StateDeltasSchema, StateVectorSchema, ConversationStatusSchema } from "./state.js";

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

export const ClientStartSessionSchema = z.object({
  event: z.literal("start_session"),
  character_id: z.string().default("alex_dorm_lounge"),
});
export type ClientStartSession = z.infer<typeof ClientStartSessionSchema>;

export const ClientMessageSchema = z.discriminatedUnion("event", [
  ClientVoiceTurnSchema,
  ClientStartSessionSchema,
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
  bubble_type: z.enum(["STANDARD_ROUND", "SHARP_ANNOYED", "HESITANT_WAVY"]),
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
  conversation_status: ConversationStatusSchema,
});
export type PanelRender = z.infer<typeof PanelRenderSchema>;

export const SystemReadSchema = z.object({
  tone: z.enum(["Polite", "Neutral", "Rude"]),
  intention: z.enum(["Curious", "Direct", "Casual", "Hostile"]),
});
export type SystemRead = z.infer<typeof SystemReadSchema>;

export const StateUpdateEventSchema = z.object({
  event: z.literal("state_update"),
  session_id: z.string(),
  turn_index: z.number().int(),
  state_updates: StateDeltasSchema,
  current_state: StateVectorSchema,
  panel_render: PanelRenderSchema,
  system_read: SystemReadSchema,
});
export type StateUpdateEvent = z.infer<typeof StateUpdateEventSchema>;

export const SessionStartedEventSchema = z.object({
  event: z.literal("session_started"),
  session_id: z.string(),
  current_state: StateVectorSchema,
  panel_render: PanelRenderSchema,
});
export type SessionStartedEvent = z.infer<typeof SessionStartedEventSchema>;

export const ErrorEventSchema = z.object({
  event: z.literal("error"),
  session_id: z.string().optional(),
  message: z.string(),
});
export type ErrorEvent = z.infer<typeof ErrorEventSchema>;

export const ServerMessageSchema = z.discriminatedUnion("event", [
  AsrProsodyEventSchema,
  StateUpdateEventSchema,
  SessionStartedEventSchema,
  ErrorEventSchema,
]);
export type ServerMessage = z.infer<typeof ServerMessageSchema>;

/* ---------- LLM orchestrator structured output ---------- */

export const OrchestratorOutputSchema = z.object({
  rapport_delta: StateDeltasSchema.shape.rapport_delta,
  patience_delta: StateDeltasSchema.shape.patience_delta,
  comfort_delta: StateDeltasSchema.shape.comfort_delta,
  boundary_violation: z.boolean(),
  sprite_pose: SpritePoseSchema,
  facial_expression: FacialExpressionSchema,
  visual_fx: z.array(VisualFxSchema),
  bubble_type: SpeechBubbleSchema.shape.bubble_type,
  dialogue: z.string(),
  detected_tone: SystemReadSchema.shape.tone,
  detected_intention: SystemReadSchema.shape.intention,
});
export type OrchestratorOutput = z.infer<typeof OrchestratorOutputSchema>;
