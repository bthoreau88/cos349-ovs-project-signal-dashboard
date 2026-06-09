# Week 1 Code Review Notes

## Files to Review in Milestone Video

1. `src/App.jsx`
   - Controls selected status state.
   - Filters project data.
   - Assembles the main app layout.

2. `src/data/projects.json`
   - Provides local project data for the proof-of-concept.
   - Replaces a database/API for Week 1 scope.

3. `src/components/Dashboard.jsx`
   - Calculates total projects, active projects, average progress, and blockers.
   - Renders metric cards and project cards.

4. `src/components/ProjectCard.jsx`
   - Displays individual project data.
   - Calculates task completion percentage.
   - Shows visual progress bars.

5. `src/components/StatusFilter.jsx`
   - Provides basic user interaction.
   - Updates dashboard view by status.

6. `src/styles/main.css`
   - Defines the OVS visual style.
   - Provides responsive layout behavior.

## Current Technical Limitations

- Data is static JSON, not a live API/database yet.
- Charts are represented as progress bars, not external chart library visualizations yet.
- No user accounts or cloud persistence.
- Testing is minimal and focused on data validation.

## Next Iteration Targets

- Add editable task data.
- Add stronger visualization.
- Add persistent data storage or API simulation.
- Expand tests.
- Improve usability based on feedback.
