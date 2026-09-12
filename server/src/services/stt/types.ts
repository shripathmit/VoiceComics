export interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

export interface TranscribeInput {
  mode: "audio" | "text";
  audioBase64?: string;
  audioFormat?: string;
  text?: string;
}

export interface TranscribeResult {
  transcription: string;
  words: WordTimestamp[];
  durationMs: number;
}

export interface SttAdapter {
  readonly name: string;
  transcribe(input: TranscribeInput): Promise<TranscribeResult>;
}
