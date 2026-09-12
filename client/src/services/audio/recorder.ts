export interface RecordedAudio {
  base64: string;
  format: string;
}

/** Thin wrapper around MediaRecorder for a single hold-to-talk take. */
export class AudioTurnRecorder {
  private stream: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: BlobPart[] = [];

  async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : "audio/webm";
    this.chunks = [];
    this.recorder = new MediaRecorder(this.stream, { mimeType });
    this.recorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };
    this.recorder.start();
  }

  async stop(): Promise<RecordedAudio> {
    const recorder = this.recorder;
    if (!recorder) throw new Error("Recorder was never started");

    const blob: Blob = await new Promise((resolve) => {
      recorder.onstop = () => resolve(new Blob(this.chunks, { type: recorder.mimeType }));
      recorder.stop();
    });

    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.recorder = null;

    const base64 = await blobToBase64(blob);
    return { base64, format: "audio/webm;codecs=opus" };
  }

  cancel(): void {
    this.recorder?.stop();
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.recorder = null;
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
