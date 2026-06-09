# Week 1 Milestone Notes

## Decisions Made

- Used local JSON as the data source to keep Week 1 scope realistic and avoid premature backend complexity.
- Chose React + Vite for fast iteration and straightforward component structure.
- Status filter implemented with useState — no external state library needed at this scale.
- Progress bars built with plain CSS rather than a chart library to reduce dependencies.

## What the App Proves

- The data model (projects, tasks, blockers, status, priority) is the right shape for the dashboard.
- Filtering by status works correctly and rerenders only the relevant cards.
- The OVS visual style (dark background, bold typography, color-coded status badges) communicates project health clearly.

## Known Gaps Going Into Week 2

- Data is read-only — no editing, adding, or removing projects from the UI.
- No persistence beyond the JSON file.
- Test coverage covers data validation only; no component rendering tests yet.
- Mobile layout needs review at narrower breakpoints.
