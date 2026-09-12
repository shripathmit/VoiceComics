export function speakWithWebSpeech(text: string, onEnd?: () => void) {
  if (!("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.02;
  utterance.pitch = 1.05;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utterance);
}

export function playAudioDataUrl(dataUrl: string, onEnd?: () => void) {
  const audio = new Audio(dataUrl);
  if (onEnd) audio.onended = onEnd;
  audio.onerror = () => onEnd?.();
  void audio.play().catch(() => onEnd?.());
}
