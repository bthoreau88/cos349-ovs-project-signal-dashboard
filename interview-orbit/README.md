# Interview Orbit

Mock interview practice tool — record spoken answers, get deterministic AI-style feedback, and track your improvement over time.

Built with React 19 + TypeScript (frontend), ASP.NET Core / .NET 9 (backend), SQLite (session storage).

---

## Quick Start

**Requirements:** Node 18+, .NET 9 SDK, Chrome or Edge (Web Speech API)

```bash
# Terminal 1 — backend
cd InterviewOrbit.Api
dotnet run
# → http://localhost:5158

# Terminal 2 — frontend
cd interview-orbit-web
npm install
npm run dev
# → http://localhost:5173
```

Open Chrome at `http://localhost:5173`. Allow microphone access when prompted.

---

## Features

| Feature | Details |
|---|---|
| Prompt library | 16 prompts across Behavioral, Technical, Frontend, and General |
| Real-time transcription | Web Speech API (Chrome/Edge); audio fallback for other browsers |
| Deterministic feedback | WPM, filler word count, pacing label, clarity notes, improvement suggestion |
| Confidence score | 0–100 composite from WPM quality + filler penalty, color-coded |
| Session history | Persistent SQLite storage, session list with trend data |
| Mobile responsive | 760px and 480px breakpoints |

---

## Test Suite

```bash
cd InterviewOrbit.Tests
dotnet test
# → 33 tests, all passing
```

---

## Project Structure

```
interview-orbit/
├── InterviewOrbit.Api/         # ASP.NET Core backend
│   ├── Application/            # Services, DTOs, interfaces
│   ├── Controllers/            # API endpoints
│   ├── Domain/                 # Entities
│   └── Infrastructure/         # DbContext, seed data
├── InterviewOrbit.Tests/       # xUnit test suite
└── interview-orbit-web/        # React + TypeScript frontend
    └── src/
        ├── app/                # Router, layout shell
        ├── components/         # Shared UI (SkeletonCard, AppFooter)
        ├── features/           # Feature modules (feedback, prompts, recording, sessions)
        ├── pages/              # Route-level components
        └── styles/             # Global CSS
```

---

COS349: Project & Portfolio IV | Full Sail University | bthoreau88
