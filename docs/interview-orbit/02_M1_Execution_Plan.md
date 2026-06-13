# Interview Orbit - M1 Execution Plan (Stabilize the Foundation)

> Prompt Pack #4 (Step-by-Step Execution Plan). Beginner-friendly, ordered,
> verify-after-each-step. Targets the M1 backlog from AGENT_HANDOFF.md section 6.
> Assumes the functional repo (React+Vite+TS frontend + ASP.NET Core API + SQLite)
> is present. Adjust paths to the real folder names once the code is in hand.

## M1 definition of done
1. Real speech-to-text replaces the fake fallback transcript, behind one interface,
   with the fallback retained as a documented backup path.
2. Dev ports and CORS are standardized so the frontend always finds the backend.
3. A DB seed + reset script exists; junk rows are cleaned.
4. A documented one-command (or near one-command) run for frontend and backend.

## Pre-flight (do first, ~15 min)
1. Confirm tools: `dotnet --version` and `node --version`. Record them in
   `00_Course_Overview/Required_Tools/` (or this repo's docs).
2. Kill any stale API process before building (handoff tech debt #3). On Windows:
   find the process holding port 5158 and stop it, or close the old terminal.
3. Run the app once as-is and confirm the existing loop works end to end.
   Backend check: open `http://localhost:5158/api/prompts` and confirm JSON.
4. Start an AI prompt log entry for M1 (academic-integrity requirement).

## Step 1 - Real speech-to-text (CRITICAL, handoff issue #1)
Goal: real transcription of the recorded answer, with the fake fallback kept behind
the same interface so a flaky recognizer or offline network can never block a demo.

1. Define one transcription interface the rest of the app calls (e.g.
   `transcribe(audio/handle) -> { text, source }` where `source` is "speech" or "fallback").
2. Implement a Web Speech API provider (`SpeechRecognition` / `webkitSpeechRecognition`).
   - Caveat: best in Chrome/Edge; uses an online recognizer. Confirm the demo browser
     (see intake doc open question).
   - Capture interim + final results; resolve with the final transcript text.
3. Keep the existing fake transcript as a named fallback provider implementing the
   same interface. Select it when Web Speech is unavailable, errors, or is offline.
4. Surface the transcript SOURCE in the UI (the Assignment 6 "transcript source label")
   so the user/grader can see "real speech" vs "demo fallback".
5. Verify: in Chrome/Edge, record a short spoken answer and confirm the transcript
   matches the words spoken and the source label reads as real STT. Then force the
   fallback (deny mic or go offline) and confirm it degrades cleanly with the label
   showing fallback.

## Step 2 - Standardize ports and lock CORS (handoff issue #2)
1. Pin the backend to `http://localhost:5158` (already the documented port).
2. Pin the Vite dev server to a fixed port (set it in the Vite config / npm script)
   so the origin stops drifting.
3. Put the backend base URL in a single frontend env/config value the API services read,
   not hardcoded per call.
4. Set the backend CORS allowed-origins to exactly the fixed Vite origin (plus any
   second one you actually use). Wire this in `Program.cs`.
5. Verify: start both, trigger a real API call from each page, confirm no CORS error
   in the browser console.

## Step 3 - DB seed + reset (handoff issue #4)
1. Write a seed that inserts a small, clean set of real prompts (categories per the
   Assignment 6 feature list) and zero junk sessions.
2. Write a reset path that drops/recreates or clears tables, then re-seeds.
3. Remove existing junk rows (placeholder titles, zero-second durations).
4. Verify: run reset, then `GET /api/prompts` returns the clean seeded set; History
   starts empty; saving a session then appears in History; data survives a restart.

## Step 4 - One-command run + text hygiene (handoff issue #5)
1. Document (and script where possible) the run: install, start backend, start frontend.
   Capture exact commands in the README run section.
2. Sweep UI text for non-ASCII separator glyphs that render as replacement characters;
   keep UI strings ASCII-safe.
3. Verify: from a clean clone, follow the documented steps and reach a working app;
   no replacement glyphs visible.

## M1 evidence to capture (for submission)
- Screen recording: real spoken answer -> matching transcript, source label visible.
- Screen recording or note: forced fallback still works and is labeled.
- Committed CORS/port config and a passing cross-page API call (console clean).
- Seed/reset run output; before/after of cleaned junk rows.
- README run steps reproduced from a clean state.

## Risks / escalate early
- Web Speech API browser dependency: if the demo browser is not Chrome/Edge, the real
  STT path may not work - confirm the browser NOW, not in Week 3.
- If real STT slips, the fallback keeps the loop demoable, but the transcript is then
  not real - which is unacceptable for the Week 3 graded think-aloud. Notify the
  Course Director immediately if M1's real-STT goal is at risk.
