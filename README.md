# Interview Orbit
### COS349 — Project & Portfolio IV | bthoreau88 | Full Sail University

---

Interview Orbit is a mock interview practice tool I built for my CS capstone. The idea is simple: you record yourself answering an interview question, and the app gives you real, useful feedback — how fast you were talking, how many filler words you used, whether you covered the key points the question was actually asking about. Then it saves your sessions so you can track whether you're actually improving over time.

I built this because practicing for interviews without any feedback is basically talking to yourself. You either pay for coaching or guess. I wanted something free, offline, and honest about what it's measuring.

---

## How to Run It

**Backend first** — it auto-creates the database and seeds the prompts on startup:
```bash
cd interview-orbit/InterviewOrbit.Api
dotnet run
```

**Then the frontend:**
```bash
cd interview-orbit/interview-orbit-web
npm install
npm run dev
```

Open `http://localhost:5173` in **Chrome or Edge** — the Web Speech API that drives the transcript only works in those browsers.

---

## What It Does

**Practice page** — Pick one of five interview prompts (Behavioral, Frontend, or General), hit record, and answer out loud. While you talk, the browser's Web Speech API transcribes your words in real time — no cloud service, no API key, just the browser doing the work. When you stop, your audio plays back immediately so you can hear yourself.

**Feedback** — The backend runs your transcript through a deterministic feedback engine: words per minute, filler word count (um, uh, like, basically, literally, you know), a pacing label, keyword coverage for that specific prompt, and one focused improvement suggestion. I kept the feedback engine deterministic on purpose — I wanted to understand and be able to explain every number it produces, not trust a black box.

**History** — Saves your last 20 sessions to SQLite. The Dashboard shows trend data (average WPM, filler count over time) so you can see whether practice is actually translating to improvement.

---

## Why These Technology Choices

**React 19 + TypeScript** — What the industry is actually using in 2026. TypeScript specifically because when I'm passing feedback data through multiple components, I'd rather catch type mismatches at compile time than debug undefined errors in the browser.

**ASP.NET Core / .NET 9** — The CS program uses C#. Building the backend in .NET meant I could apply what I'm learning in the program instead of picking up a second language mid-project.

**SQLite + EF Core** — I didn't want anyone grading or demoing this to need a database server running. SQLite creates a single file automatically on first run. That zero-infrastructure requirement was deliberate.

**Web Speech API over a cloud STT service** — Adding OpenAI Whisper or Google Speech-to-Text would mean API keys to manage, a cloud account to create, latency on every recording, and potential costs. The browser's built-in speech recognition is instant, free, and needs nothing configured. The tradeoff is Chrome/Edge only, which is worth it at this stage.

**Deterministic feedback** — No language model in the loop. Every metric is a calculation I can explain: WPM is word count divided by minutes, fillers are regex word-boundary matches, pacing thresholds are based on what interview coaches actually recommend (90–170 WPM is the target range). If a user asks "why did I get that feedback," I can show them exactly why.

---

## Project Structure

```
interview-orbit/
├── InterviewOrbit.Api/          # ASP.NET Core backend (port 5158)
│   ├── Application/
│   │   ├── DTOs/                # Request/response shapes
│   │   ├── Interfaces/          # Service contracts
│   │   └── Services/            # Feedback, session, transcription logic
│   ├── Controllers/             # HTTP endpoints
│   ├── Domain/Entities/         # Prompt, InterviewSession, FeedbackResult
│   └── Infrastructure/Data/     # EF Core context + seed data
└── interview-orbit-web/         # React frontend (port 5173)
    └── src/
        ├── app/                 # Router + shell
        ├── features/
        │   ├── recording/       # useRecorder hook + RecordingPanel
        │   ├── feedback/        # Feedback display
        │   ├── sessions/        # Session persistence
        │   └── transcript/      # Transcription API client
        └── pages/               # Dashboard, Practice, History
```

---

## API

| Method | Route | What it does |
|--------|-------|-------------|
| GET | /api/prompts | Returns the five interview prompts |
| POST | /api/feedback/analyze | Runs WPM, filler, pacing analysis on a transcript |
| POST | /api/sessions | Saves a completed session to SQLite |
| GET | /api/sessions | Returns last 20 sessions |
| GET | /api/sessions/trends | Aggregate metrics for the dashboard |

Swagger UI available at `http://localhost:5158/swagger` when the backend is running.

---

*The `/src` folder at the root is the Week 1 proof-of-concept (OVS Signal Dashboard) — kept for reference.*
