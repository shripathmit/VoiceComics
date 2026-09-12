import type { Server as HttpServer } from "node:http";
import { WebSocketServer, WebSocket } from "ws";
import type { ServerMessage } from "@voicecomics/types";
import { handleClientMessage } from "./messageRouter.js";

export function attachWebSocketServer(httpServer: HttpServer): WebSocketServer {
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (socket) => {
    const send = (msg: ServerMessage) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(msg));
      }
    };

    socket.on("message", async (data) => {
      let payload: unknown;
      try {
        payload = JSON.parse(data.toString());
      } catch {
        send({ event: "error", message: "Message was not valid JSON" });
        return;
      }
      try {
        await handleClientMessage(payload, send);
      } catch (err) {
        console.error("[ws] unhandled error while processing message:", err);
        send({ event: "error", message: "Internal error processing your turn — please try again." });
      }
    });
  });

  return wss;
}
