# 🕵️ Codedle

> A daily coding mystery game. Solve code challenges, collect hints, crack the answer.

---

## What is Codedle?

Codedle is a daily browser-based game where you solve 5 coding challenges to unlock hints one by one. Each hint brings you closer to a mystery answer — a person, a place, an event, a technology. The fewer hints you need, the higher your score.

Think Wordle — but instead of guessing letters, you're solving code to earn your clues.

Every day, everyone gets the same puzzle. One shot. Compare scores with friends.

---

## Run Locally

The frontend and backend can be started independently.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

### Backend

The backend uses FastAPI. If you run it with reload enabled, point reload at the source folder so it does not watch `backend/.venv`.

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install fastapi "uvicorn[standard]"
uvicorn server.main:app --reload --reload-dir server --reload-exclude .venv
```

Open http://127.0.0.1:8001/api/health to verify it is running.

---

## How It Works

### The Flow

```
Open Codedle → See the blank answer pattern
→ Solve Challenge 1 (easiest) → Hint 1 unlocks
→ Solve Challenge 2 → Hint 2 unlocks
→ ... and so on up to Challenge 5
→ At any point — type your answer and submit
```

You don't have to wait for all 5 hints. The moment you think you know the answer, go for it. Guess early, score higher. But wrong guesses cost you lives.

---

### The Answer Format

The answer is always shown as blanks — just like Wordle defines boundaries with 5 boxes, Codedle defines the answer shape upfront.

```
_______ ________
```

This tells you: two words, 7 letters each. You know the shape before you solve a single challenge. That's your first clue — free of charge.

No dropdowns. No suggestions. Type it out, hit enter.

---

### The Challenges

Each day has 5 challenges, increasing in difficulty. They are always mixed types:

| # | Type | What you do |
|---|------|-------------|
| 1 | Output Prediction | Read a snippet, type what it prints |
| 2 | Fill in the Blank | Complete the missing line of code |
| 3 | Bug Fix | Find and fix the one deliberate mistake |
| 4 | Reorder Lines | Drag jumbled lines into the correct order |
| 5 | Combo | Buggy code with a missing line — fix both |

Challenge difficulty ramps up deliberately. Challenge 1 should feel like a warm-up. Challenge 5 should feel earned.

---

### The Hints

Each solved challenge unlocks one hint. Hints are written to be vague early and specific late.

**Example — the mystery is Abraham Lincoln:**

```
Hint 1 → "President of America"
Hint 2 → "Second name starts with L"
Hint 3 → "Illegalized human slavery"
Hint 4 → "Assassinated in a theatre"
Hint 5 → "The 16th"
```

The mystery can be anything — a historical figure, a country, a programming language, a tech founder, a famous algorithm. The hint writing is what makes each puzzle feel fair and fun.

---

### Lives and Punishment

You get **3 lives** for wrong answer attempts and **5 attempts** per coding challenge.

**Wrong answer submitted:** Lose 1 life. Still on the same hint count.

**All 5 attempts used on a challenge:** That challenge is failed. Next challenge still unlocks — you're never fully stuck — but you don't get that hint. You carry the gap.

**All 3 lives used:** Day is over. No more guesses. The answer reveals itself and mocks you gently.

**Streak broken:** Miss a day or fail completely — your streak resets to zero. You earn one streak freeze for every 7-day streak, usable once to protect yourself.

---

### Scoring

| Guessed after | Score |
|---|-------|
| Hint 1 | 🔥 Legendary |
| Hint 2 | ⚡ Sharp |
| Hint 3 | ✅ Solid |
| Hint 4 | 😅 Safe |
| Hint 5 | 😐 Just made it |
| Failed | 💀 DNF |

Scoring also accounts for wrong answer attempts. A clean solve with no wrong guesses gets a bonus on the share card.

---

### The Share Card

```
codedle #47 🕵️
⚡ Sharp — guessed after 2 hints
0 wrong guesses | streak: 9

🟩🟩⬜⬜⬜
```

Flawless solves (no wrong guesses, guessed early) get a gold-bordered card. People will post both their wins and their failures.

---

### The Roast System

Fail a coding challenge? The app has something to say about it.

```
"a for loop beat you today"
"even the compiler felt bad"
"syntax errors are free you know"
```

Light, never mean. Contributors can add to the roast bank as a good first issue — submit 5 roast messages, open a PR.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Code Execution | Judge0 (self-hosted, open source) |
| Scheduling | Daily puzzle via cron job |
| Hosting | Render / Railway (free tier friendly) |

---

## Project Structure

```
codedle/
├── client/                  # React frontend
│   ├── components/
│   │   ├── ChallengeCard/   # Each challenge type lives here
│   │   ├── HintPanel/       # Hint reveal UI
│   │   ├── AnswerInput/     # Blank pattern + text input
│   │   ├── ShareCard/       # Result card generator
│   │   └── StreakTracker/   # Streak + freeze logic
│   └── pages/
│       ├── Game.jsx         # Main game page
│       └── Archive.jsx      # Past puzzles
│
├── server/                  # Node backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── scheduler/           # Daily puzzle rotation
│
├── content/                 # The puzzle bank
│   ├── puzzles/             # One JSON file per puzzle
│   └── roasts.json          # Roast message bank
│
└── judge0/                  # Code execution engine
```

---

## Contributing

Codedle is built for contributors. The project is deliberately structured so that every piece is independently ownable.

### Good First Issues 🟢

These require no deep knowledge of the codebase. Pick one, build it, open a PR.

- Add 5+ roast messages to `roasts.json`
- Add a new puzzle to the content bank (see puzzle format below)
- Fix a UI bug on mobile
- Add a new color theme
- Write tests for the answer checker
- Improve accessibility on the challenge cards

### Medium Issues 🟡

These require understanding one specific part of the codebase.

- Build the drag-and-drop reorder challenge component
- Build the share card generator (canvas / html-to-image)
- Build the streak freeze mechanic
- Build the daily leaderboard (most common hint count when guessed)
- Add keyboard navigation support
- Build the archive page for past puzzles
- Improve the answer matching (handle case, punctuation, spacing edge cases)

### Language Integration Issues 🔵

Each of these is a self-contained contribution. Take the existing challenge set and rewrite the code snippets in a new language. Make sure the Judge0 integration handles execution correctly for that language.

- Add Python support
- Add JavaScript support
- Add Java support
- Add C++ support
- Add Go support

Players will eventually be able to pick their preferred language. Same puzzle logic, your language.

### Core / Kernel Issues 🔴

These are handled by the project maintainer or very experienced contributors only.

- The drag-and-drop grid layout engine
- Judge0 sandbox setup and integration
- Daily puzzle scheduler and rotation logic
- The challenge registry (how new challenge types plug in)
- Save state and streak persistence

---

## Puzzle Format

Want to contribute a puzzle? Here's the format. Drop a new `.json` file in `content/puzzles/`.

```json
{
  "id": "puzzle_048",
  "answer": "Abraham Lincoln",
  "pattern": [7, 7],
  "display": "_______ ________",
  "hints": [
    "President of America",
    "Second name starts with L",
    "Illegalized human slavery",
    "Assassinated in a theatre",
    "The 16th"
  ],
  "challenges": [
    {
      "type": "output_prediction",
      "language": "python",
      "code": "x = [1, 2, 3]\nprint(x[-1] + x[0])",
      "answer": "4"
    },
    {
      "type": "fill_blank",
      "language": "python",
      "code": "def reverse_string(s):\n    return ______",
      "answer": "s[::-1]",
      "test_cases": [
        { "input": "hello", "expected": "olleh" }
      ]
    }
  ]
}
```

Hints should go from vague to specific. The last hint should make the answer almost certain. The first hint should apply to many possible answers.

---

## Inspiration

Wordle by Josh Wardle — for proving that a daily single-puzzle game with a share card is all you need.

---

## License

MIT

---

## MongoDB setup

Put your Mongo connection string in [backend/db/.env](backend/db/.env) or [backend/.env](backend/.env) as `MONGO_URI`.

Run the Mongo schema + seed script from the repo root:

```bash
node backend/run_mongo_b.mjs
```

Or run it from `backend/db` directly:

```bash
node run_mongo_b.mjs
```
