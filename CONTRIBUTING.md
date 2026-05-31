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
- Keep user-specific game state isolated so one account does not inherit another account's puzzle state.

## Backend Guidelines
- Keep API responses minimal and intentional.
- Add CORS or environment config only when the frontend actually needs it.
- When adding session or results logic, maintain one session per user per puzzle and one immutable result row per completed puzzle.

## Database Guidelines
- Keep SQL and Mongo scripts in dependency order.
- Add indexes only where they support real lookups or uniqueness rules.
- Seed data should be repeatable and safe to re-run.

## Testing and Validation
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

---

## How to Contribute

### 1. Fork the repository

Click **Fork** at the top-right of the Codedle repo on GitHub. This creates your own copy under your account.

### 2. Clone your fork locally

```bash
git clone https://github.com/YOUR-USERNAME/codedle.git
cd codedle
```

### 3. Add the upstream remote

This lets you pull in new changes from the main repo later.

```bash
git remote add upstream https://github.com/ORIGINAL-ORG/codedle.git
```

### 4. Create a feature branch

Branch off `main`. Name your branch after what you're changing.

```bash
git checkout -b feat/describe-new-feature
# or
git checkout -b fix/describe-what-is-broken
# or
git checkout -b puzzle/add-puzzle-name
# or
git checkout -b chore/update-deps
```

**Branch prefixes:**

| Prefix | Use for |
|--------|---------|
| `feat/` | New functionality |
| `fix/` | Bug fixes |
| `puzzle/` | New puzzle seeds or content |
| `chore/` | Tooling, deps, config |

### 5. Set up your local environment

Copy `.env.example` to `.env` and fill in your local values. **Never commit `.env`.**

Then install dependencies and start both services:

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend (new terminal)
cd backend
uvicorn server.main:app --reload --host 127.0.0.1 --port 8001

# Mongo seed (if needed)
cd backend
node run_mongo_b.mjs
```

### 6. Make your changes

Keep changes small and focused — one concern per PR. Follow the code rules:
- No secret puzzle fields exposed to the frontend.
- Answer validation stays server-side.
- Preserve existing naming and component structure unless a change requires otherwise.

### 7. Verify before committing

```bash
# Frontend build check
cd frontend && npm run build

# Quick backend smoke-test
curl http://127.0.0.1:8001/your-new-route
```

If you edited any db scripts, re-run them and confirm they complete without errors.

### 8. Commit with a clear message

Use present-tense imperative: `add`, `fix`, `update` — not `added` or `fixes`.

```bash
git add .
git commit -m "feat: add roast messages for wrong answers"
# or
git commit -m "fix: isolate game state per user account"
# or
git commit -m "puzzle: add week-12 seed"
```

### 9. Sync with upstream before pushing

Rebase on the latest `main` to avoid merge conflicts in your PR.

```bash
git fetch upstream
git rebase upstream/main
```

If you hit conflicts, resolve them, then:

```bash
git add .
git rebase --continue
```

### 10. Push your branch

```bash
git push origin feat/add-roast-messages
```

### 11. Open a pull request

Go to your fork on GitHub and click **Compare & pull request**. Target the `main` branch of the original repo.

In the PR description, make sure to:
- Explain what changed and why.
- Include screenshots for any visible UI changes.
- List any new environment variables or setup steps.
- Call out any follow-up work intentionally left for later.
