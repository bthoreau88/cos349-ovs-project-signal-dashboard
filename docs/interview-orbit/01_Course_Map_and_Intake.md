# Interview Orbit - Course Map and Intake (COS349 Project & Portfolio IV)

> Prompt Pack #1 (Collect the Full Picture) + #3 (Rubric Alignment Audit).
> Built from: AGENT_HANDOFF.md, Pitch 2 deck, Assignment 6 Prototype Doc.
> Purpose: lock the structure BEFORE solving. Flags what is still missing.

## Project identity
- App: Interview Orbit - browser-based mock-interview practice app.
- Core loop: pick prompt -> record spoken answer -> transcript -> rule-based feedback -> save session -> review on History/Dashboard.
- Status: continuation of a working R&D prototype (from Wearable Computing Week 5). NOT a new build, NOT a prove-the-stack exercise.
- Disclosed stack: React + TypeScript (Vite) frontend; ASP.NET Core Web API; SQLite; Web Speech API speech-to-text; browser mic APIs.

## Week-by-week map
Weights are from the handoff. Due dates, exact rubric categories, and required
filenames are NOT yet confirmed - see "Missing information" below.

| Week | Milestone | Weight | Core deliverable | Due | Rubric categories | Required files |
|------|-----------|--------|------------------|-----|-------------------|----------------|
| 1 | M1 - stabilize foundation | 15% | Real STT replaces fake transcript; ports/CORS locked; DB seed/reset; one-command run | TODO | TODO | TODO |
| 2 | M2 - extend + polish | 20% | UI polish (cards/spacing/branding); loading/empty/populated states; robust user-facing error handling; expanded prompt library | TODO | TODO | TODO |
| 3 | Usability Testing | 15% | 2 think-aloud sessions with REAL users; prioritized usability roadmap (use OfferUp analysis format) | TODO | TODO | TODO |
| 3 | M3 - feature-complete | 20% | Every interaction completes end-to-end with REAL transcript; stable + screen-recordable; stronger deterministic feedback rules | TODO | TODO | TODO |
| 4 | M4 - final | 20% | Fix top usability issues; final polish; reliable 3-5 minute demo path | TODO | TODO | TODO |
| - | GPS | 10% | Course professional/portfolio component | TODO | TODO | TODO |

Note: Week 3 is the heaviest (15% + 20% = 35%) and depends on REAL human testers,
so the app must be stable and demoable by real people before then.

## Prototype baseline (from Assignment 6) - the 8-screen spec
Flow: Dashboard -> Practice/Prompt Selection -> Recording Active -> Processing/Playback
-> Results/Transcript Feedback -> Saved Confirmation -> History -> Session Review.

| # | Screen | Purpose | Key UI |
|---|--------|---------|--------|
| 01 | Dashboard | Progress + entry point | Hero, progress summary cards, recent sessions, Start Practice |
| 02 | Practice / Prompt Selection | Choose prompt | Categories, prompt cards, selected-prompt panel, Start Recording |
| 03 | Recording Active | Show recording state | Selected prompt, status, timer, waveform, Stop, Reset |
| 04 | Processing / Playback | Recording stopped, feedback pending | Complete msg, playback, processing status, View Results |
| 05 | Results / Transcript Feedback | Core value | Prompt, playback, transcript, feedback summary, Save, Try Again |
| 06 | Saved Confirmation | Confirm save | Success, saved summary, View History, Practice Another, Dashboard |
| 07 | History | Saved sessions + continuity | Progress summary, session cards, filter/sort |
| 08 | Session Review | Inspect one attempt | Prompt, summary, transcript, feedback breakdown, Practice Similar, Back |

IMPORTANT distinction: the live Netlify URL is a CLICKABLE MOCKUP. Recording,
playback, transcription, and saved sessions are listed as "Planned for Final App."
The graded course build must make these REAL.

## Rubric alignment audit (provisional)
Until the real rubric arrives, treat these as the evidence to collect per milestone.

- M1: working real-STT demo (screen recording in target browser); CORS/port config committed; seed/reset script run output; one-command run proof.
- M2: before/after UI screenshots; each page shown in loading, empty, and populated states; each error path shown with its user-facing message.
- Week 3 Usability: 2 recorded think-aloud sessions; prioritized issue list (rank, severity, evidence quote, proposed fix, architecture note, time estimate) in the OfferUp-analysis format.
- M3: end-to-end run using a REAL recorded answer; unit-test pass output for the feedback engine.
- M4: 3-5 minute demo recording; list of usability fixes mapped back to Week 3 findings.
- All weeks: AI prompt log kept current (academic-integrity requirement).

## Missing information - CONFIRM with instructor / pull from FSO
- [ ] Exact due dates and times for M1-M4 and the usability assignment.
- [ ] Official rubric categories and point splits per milestone.
- [ ] Required submission format (zip / single file / discussion) and filename rules per week.
- [ ] What "GPS 10%" requires concretely and when it is due.
- [ ] Target demo browser for Week 3 (Web Speech API needs Chrome/Edge + online recognizer).
- [ ] Whether 2 testers is the minimum or a hard requirement for the usability sessions.
- [ ] Any required diagrams/portfolio artifacts for M4.

## Scope guardrails (do NOT build)
No auth, no user accounts, no webcam analysis, no ML/AI scoring, no resume parsing,
no cloud sync. Protect the core loop: record -> feedback -> track. Anything that does
not serve that loop is cut or deferred. Escalate to the Course Director early if
feature-complete is at risk.
