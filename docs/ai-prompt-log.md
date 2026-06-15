# AI Prompt Log - Interview Orbit (COS349 Project & Portfolio IV)

Per the course's academic-integrity expectation, this is a record of where I used
an AI assistant, what I asked for, and the decisions I made and verified myself.
The direction, review, and final choices on this project are mine.

## M1 - Stabilize the foundation

### Feedback-engine unit tests
- What I asked for: help setting up an xUnit test project for my `FeedbackService`
  and drafting Arrange-Act-Assert tests for filler count, words-per-minute, pacing,
  clarity, topic coverage, and the single improvement suggestion.
- What I decided / reviewed: I chose to test the feedback engine first because it is
  deterministic and is the course's required testing target. I checked each test
  against my own thresholds (pacing < 90 / <= 170, clarity at 25 and 180 words,
  the priority order of the improvement suggestion) to confirm they match my code.
- Bug I found and fixed: filler matching was using raw substrings, so "like" was
  being counted inside words like "likely" and "unlike". I changed it to whole-word
  matching and added a test to lock that behavior in.
- How I verified: I run `dotnet test` locally and confirm all tests pass.

### Config and CORS cleanup
- What I asked for: help stopping the frontend/backend port drift and making the
  build reliable.
- What I decided / reviewed: pin the Vite dev server to port 5173, read the backend
  URL from `VITE_API_BASE_URL`, and narrow the backend CORS policy to that one
  origin instead of a range of ports. I reviewed each change before keeping it.
- Also cleaned up: a broken `.env.local` that had been saved as a folder instead of
  a file, and some Windows-1252 characters that were showing up as broken glyphs.
- How I verified: I ran `npm run build` and confirmed a clean type-check and a
  successful production build.

### Real speech-to-text
- What I asked for: help wiring real speech-to-text into the recording flow using the
  browser Web Speech API, while keeping my existing backend transcript path as a
  documented fallback.
- What I decided / reviewed: I chose the Web Speech API because it is free, needs no
  backend key, and is the recommended student path. I had it run live while recording,
  then on stop the app uses the spoken transcript if one was captured, and otherwise
  falls back to the backend endpoint. Both paths return the same transcript shape, and
  the UI labels which source was used ("web-speech" vs the demo fallback).
- How I verified: I ran `npm run build` for a clean type-check and build. I will do the
  live microphone test in Chrome/Edge on my machine, since the Web Speech API needs a
  real browser and is best supported there.

### Database seed and reset
- What I asked for: help adding a clean way to reset my SQLite database and stop
  committing the database file to the repo.
- What I decided / reviewed: I added a `--reset-db` startup flag that deletes and
  rebuilds the database from a clean seed, so junk rows from early testing can be
  cleared on demand. I also stopped tracking the generated `.db` files in git, since
  the database should be created at runtime, not committed.
- How I verified: I run `dotnet run -- --reset-db` locally and confirm the database
  comes back with only the clean seed data.

### Expanded prompt library
- What I asked for: help adding more interview prompts so there is real variety to
  practice against.
- What I decided / reviewed: I added prompts across Behavioral, Frontend, Backend,
  Leadership, and General categories, each with its own target keywords and suggested
  length, keeping the same data shape as my existing seed.
- How I verified: I reset the database and confirmed the new prompts load in the
  prompt picker.

## Notes
- The demo-transcript fallback stays in place on purpose so a flaky recognizer or an
  offline network can never block a demo.
- I kept scope on the core record -> feedback -> track loop and did not add features
  outside of it.
