# Milestone 1 Video Script — OVS Project Signal Dashboard

## 1. Introduction

Hello, this is my Week 1 Milestone 1 proof-of-concept for Project and Portfolio IV. My project is called OVS Project Signal Dashboard. It is a productivity and project-health dashboard designed to help track creative and technical projects through project status, progress, blockers, and task completion.

## 2. App Demo

Here is the app running locally. The dashboard includes a header, project status filter, summary metrics, individual project cards, visual progress bars, and a milestone reflection panel.

The user can filter projects by status: All, Active, Planning, and Research. This proves the initial interface interaction and shows how the dashboard can help users focus on different categories of work.

## 3. Code Review

In `App.jsx`, I manage the selected status state and filter the project data before sending it to the dashboard.

In `projects.json`, I created the first local data model. This keeps the Week 1 scope simple while proving the future data structure.

In `Dashboard.jsx`, I calculate the summary metrics: total projects, active projects, average progress, and total blockers.

In `ProjectCard.jsx`, each project is displayed with status, priority, task count, blockers, summary, and progress bars.

In `StatusFilter.jsx`, I created the filter buttons that allow the user to change the displayed project list.

In `main.css`, I created the first OVS-style visual direction using a warm editorial background, sharp typography, structured cards, and restrained dashboard styling.

## 4. GitHub Review

My GitHub repo is being used to track the project in stages. I am committing setup, structure, components, data, styling, screenshots, and reflection files as separate development steps.

## 5. Trello Review

My Trello board is organized around course requirements, Week 1 tasks, work in progress, testing/review, completed items, screenshots needed, submission ready items, and blockers.

## 6. Reflection

This milestone proves the basic direction of the application. The biggest success is that the app runs and demonstrates a clear dashboard concept. The main limitation is that the data is still static. Next, I want to improve visualization, add more interaction, expand testing, and prepare for usability feedback.
