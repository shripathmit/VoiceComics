# VoiceComics

A real-time, voice-first social-simulation webcomic. Hold the mic (or type, in mock mode), and a simulated character reacts — rapport, patience, and comfort shift turn by turn, rendered as a live monochrome sketch-comic panel with synthesized character speech.

This is the MVP vertical slice: one character ("Alex", a dorm-lounge study session), one background, four poses × five expressions, three FX, and a fully working end-to-end loop. See [.claude/plans](.) history for the fuller roadmap this extends toward.

## Quick start (zero API keys)

```bash
npm install
cp .env.example .env
npm run dev
```

- Server: `http://localhost:8787` (WebSocket at `/ws`)
- Client: `http://localhost:5173`

Everything defaults to **mock mode** — no API keys required. STT is replaced by a text input, the LLM orchestrator by a deterministic rule-based responder, and TTS by the browser's built-in voice (Web Speech API). Open `http://localhost:5173`, type a line like *"Hey, mind if I sit here?"*, and watch the panel update.

## Going live

Set the relevant `*_PROVIDER` var in `.env` to the provider name and add its key:

```bash
STT_PROVIDER=deepgram
DEEPGRAM_API_KEY=...

LLM_PROVIDER=openai
OPENAI_API_KEY=...

TTS_PROVIDER=elevenlabs
ELEVENLABS_API_KEY=...
```

Each is independent — you can go live on one and stay mock on the others. If a `*_PROVIDER` is set but its key is missing, the server logs a warning and falls back to mock for that category rather than crashing. Once `STT_PROVIDER` is live, the client automatically switches from the text input to a hold-to-talk mic button.

## Mobile testing

`getUserMedia` (mic access) requires a secure context. A plain `http://<lan-ip>:5173` URL will **not** get mic permission on most mobile browsers. To test the hold-to-talk mic on a real phone:

1. Run `npm run dev` as above.
2. Tunnel the client port with ngrok / Cloudflare Tunnel / similar: `ngrok http 5173`.
3. Open the HTTPS tunnel URL on your phone.

In mock mode (default) this isn't needed — the text-input flow works over plain HTTP/LAN.

## Project layout

- `client/` — React + Vite + TypeScript, Tailwind CSS, mobile-first. The comic-panel compositor lives in `client/src/components/ComicPanel/`.
- `server/` — Node + TypeScript + Express + `ws`. The character state machine is in `server/src/state/stateMachine.ts`, the LLM orchestrator in `server/src/orchestrator/`.
- `packages/types/` — shared TypeScript types + `zod` schemas for every WebSocket message, used by both client and server.

## Scripts

- `npm run dev` — run server + client together
- `npm run typecheck` — typecheck all workspaces
- `npm test` — run the state-machine unit tests

## Out of scope for this MVP

Multiple scenarios/characters, a props layer, 4-panel shareable PNG export, streaming partial transcripts, true word-synced streaming TTS, persistence/auth, and a broader automated test suite. See the plan history for the fuller 3-sprint roadmap these extend toward.
