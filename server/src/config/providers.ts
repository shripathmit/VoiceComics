import { resolveSttAdapter } from "../services/stt/index.js";
import { resolveLlmAdapter } from "../services/llm/index.js";
import { resolveTtsAdapter } from "../services/tts/index.js";

export const providers = {
  stt: resolveSttAdapter(),
  llm: resolveLlmAdapter(),
  tts: resolveTtsAdapter(),
};

console.log(
  `[providers] stt=${providers.stt.name} llm=${providers.llm.name} tts=${providers.tts.name}`
);
