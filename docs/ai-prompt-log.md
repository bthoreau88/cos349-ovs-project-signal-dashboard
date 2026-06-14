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

## Notes
- I am intentionally keeping the demo-transcript fallback in place until I wire up
  real speech-to-text, which is my next M1 task.
- I kept scope on the core record -> feedback -> track loop and did not add features
  outside of it.
