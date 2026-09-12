import express from "express";
import cors from "cors";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { env } from "./config/env.js";
import { providers } from "./config/providers.js";
import { attachWebSocketServer } from "./ws/wsServer.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    providers: {
      stt: providers.stt.name,
      llm: providers.llm.name,
      tts: providers.tts.name,
    },
  });
});

// In production, this process also serves the built client (single Railway service).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, "../../client/dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/^(?!\/api|\/ws).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

const httpServer = createServer(app);
attachWebSocketServer(httpServer);

httpServer.listen(env.port, "0.0.0.0", () => {
  console.log(`[server] listening on http://0.0.0.0:${env.port} (ws path: /ws)`);
});
