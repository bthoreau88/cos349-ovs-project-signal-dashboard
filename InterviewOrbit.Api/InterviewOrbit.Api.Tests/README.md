# InterviewOrbit.Api.Tests

Unit tests for the deterministic feedback engine (`FeedbackService`) — the
Arrange-Act-Assert testing requirement for the course (handoff section 7).

## How to run

From the solution folder (`InterviewOrbit.Api/`):

```bash
dotnet test
```

Or target just this project:

```bash
dotnet test InterviewOrbit.Api.Tests/InterviewOrbit.Api.Tests.csproj
```

In Visual Studio: open `InterviewOrbit.Api.sln`, then Test > Run All Tests.

## What is covered

One behavior per test, with positive, negative, and boundary cases:

- Filler-word count: multiple fillers, none, case-insensitivity, multi-word
  ("you know"), empty transcript, and that substrings are NOT counted
  (e.g. "like" must not match inside "likely"/"unlike").
- Words per minute: typical, half-minute, empty transcript, and the
  zero-duration guard (no divide-by-zero).
- Pacing label: boundaries at 90 wpm (slow/balanced) and 170 wpm
  (balanced/fast), plus values on either side.
- Clarity notes: short answer, high filler density, very long answer, and a
  reasonable answer.
- Topic coverage: null keywords, empty keywords, full / partial / zero
  coverage, and case-insensitive keyword matching.
- Improvement suggestion: verifies the single, priority-ordered result
  (fillers > fast pace > short answer > incomplete coverage > default).

## Production change made alongside these tests

`FeedbackService.CountFillerWords` now matches whole words only
(`\bfiller\b`) instead of raw substrings. Before this fix, "like" was counted
inside words like "likely" and "unlike", and "um" inside "thumb", which
inflated the filler count. The test
`Analyze_DoesNotCountFillerSubstringsInsideOtherWords` pins this behavior.
