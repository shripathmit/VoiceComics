import { ServerMessageSchema, type ClientMessage, type ServerMessage } from "@voicecomics/types";

type Listener = (msg: ServerMessage) => void;
type StatusListener = (status: "connecting" | "open" | "closed") => void;

class VoiceComicsSocket {
  private ws: WebSocket | null = null;
  private listeners = new Set<Listener>();
  private statusListeners = new Set<StatusListener>();
  private reconnectAttempt = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private shouldReconnect = true;

  connect() {
    this.shouldReconnect = true;
    this.open();
  }

  private open() {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const url = `${protocol}://${window.location.host}/ws`;
    this.emitStatus("connecting");
    const ws = new WebSocket(url);
    this.ws = ws;

    ws.onopen = () => {
      this.reconnectAttempt = 0;
      this.emitStatus("open");
    };

    ws.onmessage = (event) => {
      try {
        const parsed = ServerMessageSchema.safeParse(JSON.parse(event.data));
        if (parsed.success) {
          this.listeners.forEach((listener) => listener(parsed.data));
        }
      } catch {
        // ignore malformed frames
      }
    };

    ws.onclose = () => {
      this.emitStatus("closed");
      if (this.shouldReconnect) this.scheduleReconnect();
    };

    ws.onerror = () => {
      ws.close();
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;
    const delay = Math.min(1000 * 2 ** this.reconnectAttempt, 8000);
    this.reconnectAttempt += 1;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.open();
    }, delay);
  }

  disconnect() {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
  }

  send(message: ClientMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  onMessage(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onStatusChange(listener: StatusListener): () => void {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  private emitStatus(status: "connecting" | "open" | "closed") {
    this.statusListeners.forEach((listener) => listener(status));
  }
}

export const socket = new VoiceComicsSocket();
