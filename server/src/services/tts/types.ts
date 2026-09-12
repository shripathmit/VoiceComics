export interface TtsResult {
  /** null means "no server audio — client should speak the line via Web Speech" */
  audioDataUrl: string | null;
  useClientTts: boolean;
}

export interface TtsAdapter {
  readonly name: string;
  synthesize(text: string): Promise<TtsResult>;
}
