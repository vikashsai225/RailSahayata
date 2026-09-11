# RailSahayata Agent Guide

## Project snapshot
This repository is a railway operations prototype with two main services:
- [backend](backend): Express API and rule-based railway planning logic.
- [frontend](frontend): Vite + React dashboard UI for operations, maintenance, and AI prioritization.

## Working conventions
- Keep frontend work in [frontend/src](frontend/src) and backend work in [backend](backend). Do not mix responsibilities.
- Treat [backend/server.js](backend/server.js) as the API entry point and [frontend/src/App.jsx](frontend/src/App.jsx) as the route shell.
- The existing app pattern is a single-page dashboard with route-based pages under [frontend/src/pages](frontend/src/pages) and shared layout in [frontend/src/components/layout](frontend/src/components/layout).
- Prefer small, incremental changes that match the current styling and structure instead of adding new libraries or architectural layers.

## Run and verify commands
From the repo root:

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Expected local ports:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Architecture and file boundaries
- Backend route registration lives in [backend/server.js](backend/server.js) and [backend/routes](backend/routes).
- AI priority calculation logic currently lives in [backend/services/aiPriorityService.js](backend/services/aiPriorityService.js) and reads data from [backend/data/priorityTasks.json](backend/data/priorityTasks.json).
- API route handlers should stay thin and delegate business logic to service files instead of embedding logic directly in route code.
- Frontend navigation and page registration are centralized in [frontend/src/App.jsx](frontend/src/App.jsx) and [frontend/src/components/layout/Sidebar.jsx](frontend/src/components/layout/Sidebar.jsx).
- Page components should be lightweight functional components, usually matching the existing inline-style dashboard pattern.

## Project-specific rules
- Do not add server-side fetch calls inside backend files; the backend is an API server, not a client app.
- Do not import React/JSX modules into backend files.
- When adding a new page:
  1. create the page component under [frontend/src/pages](frontend/src/pages)
  2. register the route in [frontend/src/App.jsx](frontend/src/App.jsx)
  3. add the nav item in [frontend/src/components/layout/Sidebar.jsx](frontend/src/components/layout/Sidebar.jsx)
- Keep route paths consistent with the existing naming scheme:
  - /dashboard
  - /maintenance-tasks
  - /corridor-availability
  - /ai-priority
  - /block-planning
  - /weekly-planning
  - /monthly-planning
  - /conflict-resolution
  - /reports
  - /system-integration

## Backend logic notes
The current AI priority engine is rule-based. It scores tasks using fields such as:
- safetyRisk
- delayImpact
- assetCriticality
- maintenanceUrgency
- resourceAvailability

The scoring pipeline is implemented in [backend/services/aiPriorityService.js](backend/services/aiPriorityService.js). If you change task ranking or labels, keep behavior aligned with the existing JSON task schema in [backend/data/priorityTasks.json](backend/data/priorityTasks.json).

## Common pitfalls
- Do not create a new framework or app shell unless the task clearly requires it.
- Avoid adding backend-only logic to the frontend or frontend-only fetching to the backend.
- Before claiming success, always verify the affected route and API still work locally.
- There are no automated tests configured in this repo yet, so manual startup checks are the main validation path.

## Validation checklist
Before calling work complete, verify:
- backend starts successfully with `npm start`
- frontend starts successfully with `npm run dev -- --host 0.0.0.0 --port 5173`
- the target page loads without console errors
- the relevant API endpoint responds correctly on port 5000

## Helpful references
- [frontend/src/App.jsx](frontend/src/App.jsx)
- [frontend/src/components/layout/Sidebar.jsx](frontend/src/components/layout/Sidebar.jsx)
- [backend/server.js](backend/server.js)
- [backend/routes/aiPriorityRoutes.js](backend/routes/aiPriorityRoutes.js)
- [backend/services/aiPriorityService.js](backend/services/aiPriorityService.js)
- [backend/data/priorityTasks.json](backend/data/priorityTasks.json)

This project is intentionally lightweight and operational rather than highly abstracted, so keep customizations small, consistent, and easy to follow for the next agent.
