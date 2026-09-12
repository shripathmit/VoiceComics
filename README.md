# VoiceComics

A real-time, voice-first interactive story engine. The app narrates a scene and illustrates it as a live monochrome sketch-comic panel; you speak (or type, in mock mode) what you do; the story continues based on your action; after a handful of beats it reaches a real ending. The payoff is a full comic-strip recap of your playthrough, exportable as a PNG.

The current story is **"The Late Shift"** — a solo mystery/suspense premise, one background, four poses × five expressions, three FX, and a fully working end-to-end loop from opening beat to comic export. See [.claude/plans](.) history for the fuller roadmap (a scene picker, multiple premises, real multi-counterpart scenes) this extends toward.

## Quick start (zero API keys)

```bash
npm install
cp .env.example .env
npm run dev
```

- Server: `http://localhost:8787` (WebSocket at `/ws`)
- Client: `http://localhost:5173`

Everything defaults to **mock mode** — no API keys required. STT is replaced by a text input, the story orchestrator by a deterministic keyword-classifying beat bank (bold / cautious / curious / neutral actions each pick from hand-authored narration), and TTS by the browser's built-in voice (Web Speech API). Open `http://localhost:5173` and type what you do at each beat, e.g. *"I open the file and read it"*.

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

Each is independent — you can go live on one and stay mock on the others. If a `*_PROVIDER` is set but its key is missing, the server logs a warning and falls back to mock for that category rather than crashing. Once `STT_PROVIDER` is live, the client automatically switches from the text input to a hold-to-talk mic button. Live mode hands the same narration job to an LLM (OpenAI), which continues the story from the transcript instead of the keyword beat bank.

## Mobile testing

`getUserMedia` (mic access) requires a secure context. A plain `http://<lan-ip>:5173` URL will **not** get mic permission on most mobile browsers. To test the hold-to-talk mic on a real phone:

1. Run `npm run dev` as above.
2. Tunnel the client port with ngrok / Cloudflare Tunnel / similar: `ngrok http 5173`.
3. Open the HTTPS tunnel URL on your phone.

In mock mode (default) this isn't needed — the text-input flow works over plain HTTP/LAN.

## Project layout

- `client/` — React + Vite + TypeScript, Tailwind CSS, mobile-first. The comic-panel compositor lives in `client/src/components/ComicPanel/`; the three screens (story, ending, comic strip) are `StoryView.tsx`, `components/StoryEnd/`, and `components/ComicExport/`.
- `server/` — Node + TypeScript + Express + `ws`. Story premises live in `server/src/story/premises.ts`, the beat-continuation orchestrator in `server/src/orchestrator/`.
- `packages/types/` — shared TypeScript types + `zod` schemas for every WebSocket message, used by both client and server.

## Scripts

- `npm run dev` — run server + client together
- `npm run typecheck` — typecheck all workspaces
- `npm test` — run the server unit tests (keyword classifier + ending-tally logic)

## Out of scope for now

A scene-picker screen, multiple story premises, real multi-counterpart scenes (more than one character on screen at once), true word-synced streaming TTS, persistence/auth, and a broader automated test suite. See the plan history for the fuller roadmap these extend toward.
