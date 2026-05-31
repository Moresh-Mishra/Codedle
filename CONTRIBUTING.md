# Contributing to Codedle

Thanks for helping improve Codedle. This project is a daily coding mystery game with a React frontend, a FastAPI backend, and PostgreSQL / MongoDB schema artifacts in the backend db folder.

## Before You Start

- Read the main project overview in [README.md](README.md).
- Check the current route and auth flow before changing navigation or protected pages.
- Keep puzzle content, game state, and user session logic consistent across frontend and backend.
- Do not commit secrets. Store connection strings in `.env` files only.

## Project Layout

- `frontend/` contains the React app and UI state.
- `backend/server/` contains the FastAPI API.
- `backend/db/` contains SQL and MongoDB setup scripts.
- `content/puzzles/` stores puzzle JSON files.

## Local Setup

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
uvicorn server.main:app --reload --host 127.0.0.1 --port 8001
```

MongoDB seed/setup:

```bash
cd backend
node run_mongo_b.mjs
```

## Code Rules

- Prefer small, focused changes.
- Keep UI behavior aligned with auth state.
- Do not expose secret puzzle fields to the frontend.
- Keep answer validation server-side when adding real gameplay endpoints.
- Preserve existing naming and component structure unless a change requires otherwise.

## Frontend Guidelines

- Update routing and navigation together when adding protected pages.
- Use the auth provider for login state instead of duplicating local flags.
- Keep user-specific game state isolated so one account does not inherit another account’s puzzle state.

## Backend Guidelines

- Keep API responses minimal and intentional.
- Add CORS or environment config only when the frontend actually needs it.
- When adding session or results logic, maintain one session per user per puzzle and one immutable result row per completed puzzle.

## Database Guidelines

- Keep SQL and Mongo scripts in dependency order.
- Add indexes only where they support real lookups or uniqueness rules.
- Seed data should be repeatable and safe to re-run.

## Testing and Validation
g
- Run a frontend build after UI changes.
- Verify backend routes with a direct request or browser call.
- If you edit db scripts, verify the file still runs cleanly before opening a PR.

## Pull Request Checklist

- Explain what changed and why.
- Include screenshots for visible UI changes.
- Mention any new environment variables or setup steps.
- Call out any follow-up work that was intentionally left for later.

## Good First Contributions

- Improve a page layout or mobile behavior.
- Add a new puzzle seed.
- Add a roast message.
- Improve auth UI copy or state handling.
- Tighten validation or error handling in an existing route.
