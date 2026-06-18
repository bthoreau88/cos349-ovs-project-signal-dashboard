# COS349 — Project & Portfolio IV: Computer Science
### Student: bthoreau88 | Full Sail University | 2026

---

## Interview Orbit — Milestone 2 Submission

Interview Orbit is a browser-based mock-interview practice application built for COS349.
Users select an interview prompt, record a spoken response, receive AI-assisted feedback,
and track their progress over time on the history dashboard.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite |
| Routing | React Router v7 |
| Backend | ASP.NET Core Web API (.NET 9) |
| Database | SQLite via Entity Framework Core |
| API Docs | Swagger (Swashbuckle) |
| Speech-to-Text | Web Speech API (browser-native, Chrome/Edge) |

### Features

- **5 Interview Prompts** — Behavioral, Frontend Engineering, and General categories
- **Browser-based Recording** — MediaRecorder API with full permission-error handling
- **Real-time Transcript** — Web Speech API runs in parallel with MediaRecorder
- **Deterministic Feedback Engine** — WPM, filler-word count, pacing label, improvement tips
- **Session Persistence** — SQLite database via RESTful API, 20-session history
- **History Dashboard** — Trend metrics (WPM and filler words over time)
- **Audio Playback** — Listen back to your recording immediately after each session

### Running Locally

**Backend (port 5158)**
```bash
cd interview-orbit/InterviewOrbit.Api
dotnet run
```

**Frontend (port 5173)**
```bash
cd interview-orbit/interview-orbit-web
npm install
npm run dev
```

Open `http://localhost:5173` in Chrome or Edge (required for Web Speech API).

### API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/prompts | List all interview prompts |
| POST | /api/transcription | Backend transcription fallback |
| POST | /api/feedback/analyze | Analyze transcript for WPM, fillers, pacing |
| GET | /api/sessions | List last 20 saved sessions |
| GET | /api/sessions/trends | Aggregate trend data |
| POST | /api/sessions | Save a completed session |

### Project Structure

```
interview-orbit/
├── InterviewOrbit.Api/          # ASP.NET Core backend
│   ├── Application/
│   │   ├── DTOs/                # Request/response data contracts
│   │   ├── Interfaces/          # Service abstractions (ISP)
│   │   └── Services/            # Business logic
│   ├── Controllers/             # HTTP API endpoints
│   ├── Domain/Entities/         # Domain models (Prompt, Session, Feedback)
│   └── Infrastructure/Data/     # EF Core DbContext + seed data
└── interview-orbit-web/         # React frontend
    └── src/
        ├── app/                 # Router + app shell
        ├── features/
        │   ├── recording/       # MediaRecorder + Web Speech API hook
        │   ├── feedback/        # Feedback display components
        │   ├── sessions/        # Session persistence
        │   └── transcript/      # Transcription API client
        └── pages/               # Dashboard, Practice, History pages
```

### Milestone Checklist

- [x] App runs locally (Chrome/Edge, localhost:5173)
- [x] Real transcript via Web Speech API
- [x] Feedback engine (WPM, fillers, pacing, suggestions)
- [x] Session persistence (SQLite via ASP.NET Core)
- [x] History dashboard with trend data
- [x] Audio playback after recording
- [x] GitHub repo with multiple commits
- [ ] Trello board updated
- [ ] Milestone 2 video recorded and submitted

---

*Week 1 proof-of-concept (OVS Signal Dashboard) is preserved in `/src` for reference.*
