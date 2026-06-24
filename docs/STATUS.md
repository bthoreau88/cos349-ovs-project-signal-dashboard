# Interview Orbit - Project Sync / Status (COS349 Project & Portfolio IV)

> Living status doc so work in VS (Claude Code) and the cloud session stay in sync.
> Update the "Where we are" and "Done" sections as things change.

## Repo & branch
- Repo: `bthoreau88/cos349-ovs-project-signal-dashboard`
- Active branch: `claude/interview-orbit-m1` (the real, current build)
- `main` also points at the same commit (repo default view = Interview Orbit)
- Old OVS dashboard is preserved on `claude/exciting-shannon-5cl89p` (ignore for this project)
- Folder layout: backend at `InterviewOrbit.Api/InterviewOrbit.Api/`,
  frontend nested at `InterviewOrbit.Api/InterviewOrbit.Api/interview-orbit-web/`

## What's done & verified working on the machine
- Backend runs (`dotnet run -- --reset-db`) -> API on http://localhost:5158, Swagger up, 8 seeded prompts
- Unit tests: 29 passed / 0 failed (`dotnet test`)
- Frontend runs (`npm.cmd run dev`) -> http://localhost:5173, app loads
- Full loop works end-to-end: select prompt -> record -> transcript -> feedback -> Save -> History
- NOTE: a too-short recording falls back to `Source: fallback-demo`. A clean 15-20s spoken
  take should show `Source: web-speech` (this week's headline feature) for the demo.

## Key design decisions (do not undo)
- Real STT lives in `useSpeechRecognition.ts`; `resolveTranscript()` prefers live speech and
  falls back to the backend `/api/transcription` (intentional, labeled fallback). Both return
  the same `TranscriptResponse`.
- Config: frontend reads `VITE_API_BASE_URL` via `apiClient.ts`; Vite pinned to port 5173
  (`vite.config.ts`); backend CORS allows only http://localhost:5173.
- DB: SQLite is generated at runtime, NOT committed. `--reset-db` flag wipes + reseeds clean.
- Feedback engine (`FeedbackService.cs`) is the tested unit; filler matching is whole-word
  (`\bword\b`) - a bug fixed this week and pinned by a test.
- Tests live in `InterviewOrbit.Api.Tests/` (xUnit).

## M2 submission workflow (8 steps)
1. [x] Pull latest code
2. [x] Run backend
3. [x] Run tests (29 pass)
4. [x] Run frontend
5. [ ] Live record test (need a clean `web-speech` take)
6. [ ] Update Trello (card per feature, check off done)
7. [ ] Record the M2 video (app demo, code review, Trello, GitHub commits, self-reflection)
8. [ ] Submit: post YouTube link in the M2 "Feedback" section

## Deadlines / status
- M1: closed (no credit) - do not work on it.
- M2: due Jun 15 8:59 PM PDT - 3-day late window for FULL grade, submit via the Feedback
  section (~by Jun 18).
- M4 (week 4): NO late work allowed - M3/M4 must be on time.

## How we stay in sync (non-destructive)
- Both Claude Code (VS) and the cloud session work on `claude/interview-orbit-m1`.
- Before editing: `git pull origin claude/interview-orbit-m1`. After editing: commit + push.
- Never force-push this shared branch.
- When picking back up, run `git log --oneline -5` and note which files changed.
