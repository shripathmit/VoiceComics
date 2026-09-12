import "dotenv/config";

export const env = {
  port: Number(process.env.PORT ?? 8787),

  // Each defaults to "mock" (zero API keys required). Set to the provider
  // name to opt into a live adapter, e.g. STT_PROVIDER=deepgram.
  sttProvider: (process.env.STT_PROVIDER ?? "mock").toLowerCase(),
  llmProvider: (process.env.LLM_PROVIDER ?? "mock").toLowerCase(),
  ttsProvider: (process.env.TTS_PROVIDER ?? "mock").toLowerCase(),

  openaiApiKey: process.env.OPENAI_API_KEY,
  deepgramApiKey: process.env.DEEPGRAM_API_KEY,
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
};
