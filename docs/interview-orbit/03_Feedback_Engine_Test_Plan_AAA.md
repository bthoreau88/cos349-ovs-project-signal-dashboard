# Interview Orbit - Feedback Engine Unit Test Plan (Arrange-Act-Assert)

> Prompt Pack #6 (Unit Test Planning) + AGENT_HANDOFF.md section 7 (testing
> requirement). Target: the DETERMINISTIC rule-based feedback engine on the .NET
> side. Framework: xUnit or MSTest. Keep test code separate from production code -
> no test-only methods in production classes. Tests must be fast, isolated,
> repeatable, self-verifying. One behavior per test.

## What the engine produces (units under test)
From the handoff and Assignment 6: filler-word count, words-per-minute (WPM),
pacing label, clarity notes, topic coverage, and one recommended improvement.
Each rule below should be a small pure function so it is trivially testable.

## General testing rules
- Arrange real inputs (a transcript string + a duration); Act calls one rule;
  Assert one outcome.
- Cover positive (typical), negative (absent/none), and boundary (threshold edges).
- No network, no DB, no clock, no randomness in these tests. If the engine reads
  thresholds from config, inject them so tests stay deterministic.
- Confirm the exact threshold values with the production code before locking the
  boundary tests below (placeholders are marked).

## 1. Filler-word count
Counts filler terms (e.g. "um", "uh", "like", "you know") in a transcript.

| Test | Arrange | Act | Assert |
|------|---------|-----|--------|
| Counts multiple fillers | Transcript with 3 known fillers | CountFillers | returns 3 |
| No fillers | Clean transcript, 0 fillers | CountFillers | returns 0 |
| Case-insensitive | "Um" vs "um" vs "UM" | CountFillers | all counted |
| Word-boundary only | "umbrella", "likely" present | CountFillers | returns 0 (no false hits) |
| Empty transcript | "" | CountFillers | returns 0, no throw |
| Multi-word filler | "you know" appears once | CountFillers | counts as 1 occurrence |

## 2. Words per minute (WPM)
WPM = word_count / (duration_seconds / 60).

| Test | Arrange | Act | Assert |
|------|---------|-----|--------|
| Typical case | 150 words, 60s | ComputeWpm | 150 |
| Half minute | 75 words, 30s | ComputeWpm | 150 |
| Zero duration guard | 100 words, 0s | ComputeWpm | safe value (0 or defined sentinel), no divide-by-zero |
| Empty transcript | 0 words, 60s | ComputeWpm | 0 |
| Rounding rule | words/duration that is non-integer | ComputeWpm | matches the production rounding rule (confirm) |

## 3. Pacing label
Maps WPM to a label (e.g. Slow / Good / Fast). CONFIRM exact thresholds in code.

| Test | Arrange (WPM) | Act | Assert |
|------|---------------|-----|--------|
| Slow | below slow threshold (placeholder) | LabelPacing | "Slow" |
| Good - typical | mid-range value | LabelPacing | "Good" |
| Fast | above fast threshold (placeholder) | LabelPacing | "Fast" |
| Boundary - low edge | exactly the slow/good threshold | LabelPacing | label per inclusive/exclusive rule (confirm) |
| Boundary - high edge | exactly the good/fast threshold | LabelPacing | label per inclusive/exclusive rule (confirm) |
| Zero WPM | 0 | LabelPacing | defined label, no throw |

## 4. Clarity notes
Deterministic notes from clarity signals (e.g. high filler density, very long answer).

| Test | Arrange | Act | Assert |
|------|---------|-----|--------|
| High filler density flagged | transcript above filler-density threshold | BuildClarityNotes | includes the filler-density note |
| Clean answer | low fillers, normal length | BuildClarityNotes | no negative clarity note (or "clear") |
| Boundary at threshold | density exactly at threshold | BuildClarityNotes | behaves per the defined rule (confirm) |
| Empty transcript | "" | BuildClarityNotes | safe default, no throw |

## 5. Topic coverage
Checks the answer against the prompt's target keywords.

| Test | Arrange | Act | Assert |
|------|---------|-----|--------|
| All keywords present | transcript hits every target keyword | ScoreCoverage | full coverage |
| Partial coverage | hits some, misses some | ScoreCoverage | reports the matched subset correctly |
| None present | hits no keywords | ScoreCoverage | zero coverage, lists what is missing |
| Case/parse robustness | keyword present in different case/inflection per the production rule | ScoreCoverage | matched per the defined rule (confirm) |

## 6. Recommended improvement (single)
Picks exactly one actionable improvement by priority (so feedback is not overwhelming).

| Test | Arrange | Act | Assert |
|------|---------|-----|--------|
| Returns exactly one | inputs that trigger several issues | PickImprovement | returns a single recommendation |
| Highest priority wins | filler + pacing + coverage all bad | PickImprovement | returns the top-priority rule's recommendation |
| Clean answer fallback | no issues triggered | PickImprovement | returns a defined positive/no-op message, never null |

## Project setup notes
- Put tests in a separate test project (e.g. `InterviewOrbit.Tests`) referencing the
  API/services project; do not add test-only code to production classes.
- Name tests for behavior: `CountFillers_WithThreeFillers_ReturnsThree`.
- Run with `dotnet test`; capture passing output as M3 evidence.
- Confirm every "(confirm)" threshold/rounding/inclusivity rule against the real
  production code before finalizing boundary assertions.
