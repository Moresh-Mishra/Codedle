import { useEffect, useMemo, useState } from "react";
import ChallengeRenderer from "../components/ChallengeRenderer.jsx";
import samplePuzzle from "../data/samplePuzzle.js";
import {
  advanceChallenge,
  answerMatches,
  applyChallengeFailure,
  challengeMatches,
  createRoastPicker,
  finishGame,
  formatPattern,
  getChallengeAttemptsRemaining,
  isPuzzleOver,
  loadGameState,
  saveGameState,
} from "../game/codedleGame.js";
import { useAuth } from "../AuthProvider.jsx";

export default function TerminalPage() {
  const puzzle = samplePuzzle;
  const { authUser, isLoading } = useAuth();
  const sessionOwnerId = authUser?.id ?? "guest";
  const [state, setState] = useState(() => loadGameState(puzzle, sessionOwnerId));
  const [answerInput, setAnswerInput] = useState("");
  const [statusMessage, setStatusMessage] = useState("Solve the first challenge to unlock your first hint.");

  useEffect(() => {
    const nextState = loadGameState(puzzle, sessionOwnerId);
    setState(nextState);
    setAnswerInput("");
    setStatusMessage(nextState.solved ? "Puzzle already solved." : "Solve the first challenge to unlock your first hint.");
  }, [puzzle, sessionOwnerId]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!authUser?.id) {
      return;
    }

    const nextState = loadGameState(puzzle, authUser.id);
    setState(nextState);
    setAnswerInput("");
    setStatusMessage(nextState.solved ? "Puzzle already solved." : "Solve the first challenge to unlock your first hint.");
  }, [authUser?.id, isLoading, puzzle]);

  useEffect(() => {
    saveGameState(state);
  }, [state]);

  const roastPicker = useMemo(() => createRoastPicker(puzzle.roasts, state.shownRoasts), [puzzle.roasts, state.shownRoasts]);

  const currentChallenge = puzzle.challenges[Math.min(state.currentChallenge, 4)] ?? null;
  const activeHints = puzzle.hints.slice(0, state.hintsUnlocked);
  const lockedHints = puzzle.hints.slice(state.hintsUnlocked);
  const answerModeOpen = state.answerMode || state.solved || state.failed;

  const handleChallengeSubmit = (submission) => {
    if (!currentChallenge || isPuzzleOver(state)) {
      return;
    }

    if (challengeMatches(currentChallenge, submission)) {
      const nextState = {
        ...advanceChallenge(state),
        currentRoast: "",
      };
      setState(nextState);

      if (nextState.answerMode) {
        setStatusMessage("All five challenges are resolved. Answer mode is open.");
      } else {
        setStatusMessage(`Challenge ${state.currentChallenge + 1} solved. Hint ${nextState.hintsUnlocked} unlocked.`);
      }

      return;
    }

    const roast = roastPicker.pick();
    const nextState = applyChallengeFailure(state, state.currentChallenge);
    nextState.currentRoast = roast;
    nextState.shownRoasts = state.shownRoasts.includes(roast) ? state.shownRoasts : [...state.shownRoasts, roast];
    setState(nextState);

    if (nextState.currentChallenge !== state.currentChallenge) {
      setStatusMessage(`Challenge ${state.currentChallenge + 1} failed. Moving on.`);
    } else {
      setStatusMessage(roast);
    }
  };

  const handleFinalGuess = (event) => {
    event.preventDefault();

    if (isPuzzleOver(state)) {
      return;
    }

    if (answerMatches(puzzle, answerInput)) {
      const nextState = finishGame(
        {
          ...state,
          hintsUnlocked: Math.max(state.hintsUnlocked, 1),
          currentRoast: "",
        },
        puzzle,
        true
      );

      setState(nextState);
      setStatusMessage(`Correct. Score ${nextState.score}.`);
      return;
    }

    const nextLives = Math.max(state.answerLives - 1, 0);

    if (nextLives === 0) {
      const nextState = finishGame(
        {
          ...state,
          answerLives: 0,
          failed: true,
          currentRoast: "No lives left. The answer is revealed.",
        },
        puzzle,
        false
      );

      setState(nextState);
      setStatusMessage("No lives left. Game over for today.");
      return;
    }

    const nextState = {
      ...state,
      answerLives: nextLives,
      wrongGuessCount: state.wrongGuessCount + 1,
      currentRoast: "Wrong answer. Lives reduced.",
    };

    setState(nextState);
    setStatusMessage("Wrong answer. Lives reduced.");
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-outline-variant bg-surface-container-low px-5 py-4 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">Codedle / Daily Puzzle</p>
            <h1 className="text-2xl font-semibold text-primary">{formatPattern(puzzle.pattern)}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-on-surface-variant">
            <span className="rounded-full border border-outline-variant px-3 py-1">Challenge {Math.min(state.currentChallenge + 1, 5)} / 5</span>
            <span className="rounded-full border border-outline-variant px-3 py-1">Lives: {state.answerLives}</span>
            <span className="rounded-full border border-outline-variant px-3 py-1">Score: {state.score ?? "pending"}</span>
          </div>
        </header>

        {(state.solved || state.failed) && (
          <div className={`rounded-3xl border px-5 py-4 ${state.solved ? "border-primary/30 bg-primary/10" : "border-error/30 bg-error/10"}`}>
            <p className="text-sm font-semibold text-on-surface">
              {state.solved ? `Puzzle solved. Final score: ${state.score}` : `Puzzle failed. Answer: ${puzzle.answer}`}
            </p>
          </div>
        )}

        <main className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <section className="space-y-6 rounded-3xl border border-outline-variant bg-surface-container-low p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">Hints</p>
              <div className="flex flex-wrap gap-2">
                {activeHints.map((hint) => (
                  <span key={hint} className="rounded-full bg-primary-container px-3 py-1 text-sm text-on-primary-container">
                    {hint}
                  </span>
                ))}
                {lockedHints.map((hint, index) => (
                  <span key={hint} className="rounded-full border border-dashed border-outline-variant px-3 py-1 text-sm text-on-surface-variant">
                    Hint {state.hintsUnlocked + index + 1} locked
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-outline-variant bg-background p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-on-surface-variant">Current challenge</p>
              <p className="mt-2 text-lg font-semibold text-on-surface">{currentChallenge ? currentChallenge.title : "No current challenge"}</p>
              <p className="mt-1 text-sm text-on-surface-variant">
                {answerModeOpen ? "Answer submission is open." : `You are on challenge ${state.currentChallenge + 1}.`}
              </p>
            </div>

            <ChallengeRenderer
              attemptsRemaining={getChallengeAttemptsRemaining(state, state.currentChallenge)}
              challenge={currentChallenge}
              disabled={isPuzzleOver(state)}
              onSubmit={handleChallengeSubmit}
            />

            <form className="space-y-3 rounded-3xl border border-outline-variant bg-background p-5" onSubmit={handleFinalGuess}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">Final answer</p>
                  <p className="text-sm text-on-surface-variant">Always visible. Guess early if you know it.</p>
                </div>
                <span className="rounded-full border border-outline-variant px-3 py-1 text-xs uppercase tracking-[0.2em] text-on-surface-variant">
                  {state.answerLives} lives
                </span>
              </div>
              <input
                className="w-full rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3 font-medium text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                disabled={state.solved || state.failed}
                onChange={(event) => setAnswerInput(event.target.value)}
                placeholder={puzzle.display}
                value={answerInput}
              />
              <button
                className="w-full rounded-2xl bg-primary px-4 py-3 font-semibold text-on-primary transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={state.solved || state.failed}
                type="submit"
              >
                Submit answer
              </button>
            </form>
          </section>

          <aside className="space-y-6 rounded-3xl border border-outline-variant bg-surface-container-low p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="space-y-2 rounded-3xl border border-outline-variant bg-background p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">State</p>
              <div className="grid gap-3 text-sm text-on-surface-variant">
                <div className="flex items-center justify-between">
                  <span>Hints unlocked</span>
                  <span className="font-semibold text-on-surface">{state.hintsUnlocked}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Failed challenges</span>
                  <span className="font-semibold text-on-surface">{state.failedChallenges.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Zero-fail bonus</span>
                  <span className="font-semibold text-on-surface">{state.failedChallenges.length === 0 ? "+2" : "0"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Started</span>
                  <span className="font-semibold text-on-surface">{new Date(state.timeStarted).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-outline-variant bg-background p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">Roast bar</p>
              <p className="mt-3 min-h-12 rounded-2xl bg-surface-container px-4 py-3 text-sm italic text-on-surface">{state.currentRoast || statusMessage}</p>
            </div>

            <div className="rounded-3xl border border-outline-variant bg-background p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant">Session summary</p>
              <p className="mt-3 text-sm text-on-surface-variant">Local state persists in `localStorage`. Archive is captured when the puzzle resolves.</p>
              <p className="mt-3 text-sm text-on-surface-variant">Judge0 execution, streaks, and sharing are next in the build order.</p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}