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
import { FadeIn } from "../components/ui/FadeIn.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Info, Zap, Target, Activity, ChevronRight, Timer, Trophy } from "lucide-react";

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
    if (isLoading) return;
    if (!authUser?.id) return;

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
    if (!currentChallenge || isPuzzleOver(state)) return;

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
    if (isPuzzleOver(state)) return;

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

    setState({
      ...state,
      answerLives: nextLives,
      wrongGuessCount: state.wrongGuessCount + 1,
      currentRoast: "Wrong answer. Lives reduced.",
    });
    setStatusMessage("Wrong answer. Lives reduced.");
  };

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-6 lg:px-8">
        <FadeIn delay={0.1}>
          <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-surface-outline bg-surface-paper px-5 py-4 shadow-sm glass-card">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-secondary font-label-caps">Codedle / Daily Puzzle</p>
              <h1 className="text-2xl font-bold text-primary">{formatPattern(puzzle.pattern)}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline">Challenge {Math.min(state.currentChallenge + 1, 5)} / 5</Badge>
              <Badge variant="outline">Lives: {state.answerLives}</Badge>
              <Badge variant="primary">Score: {state.score ?? "pending"}</Badge>
            </div>
          </header>
        </FadeIn>

        {(state.solved || state.failed) && (
          <FadeIn delay={0.2}>
            <div className={`rounded-2xl border px-5 py-4 text-center font-medium ${state.solved ? "border-primary/30 bg-primary/10 text-primary" : "border-error/30 bg-error/10 text-error"}`}>
              {state.solved ? `Puzzle solved. Final score: ${state.score}` : `Puzzle failed. Answer: ${puzzle.answer}`}
            </div>
          </FadeIn>
        )}

        <main className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div className="space-y-6">
            <FadeIn delay={0.3}>
              <Card title="Strategic Intel">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {activeHints.map((hint) => (
                      <Badge key={hint} variant="primary">{hint}</Badge>
                    ))}
                    {lockedHints.map((hint, index) => (
                      <span key={hint} className="px-3 py-1 rounded-full border border-dashed border-surface-outline text-sm text-secondary opacity-60">
                        Hint {state.hintsUnlocked + index + 1} locked
                      </span>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl border border-surface-outline bg-surface-muted group hover:border-primary transition-colors">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                      <Target size={16} />
                      <p className="text-xs uppercase tracking-widest font-bold">Current Objective</p>
                    </div>
                    <p className="text-lg font-semibold text-on-surface">{currentChallenge ? currentChallenge.title : "No current challenge"}</p>
                    <p className="mt-1 text-sm text-secondary">
                      {answerModeOpen ? "Answer submission is now active." : `Progress: Challenge ${state.currentChallenge + 1} of 5.`}
                    </p>
                  </div>
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.4}>
              <Card title="Execution Terminal" subtitle="Resolve logic filters to proceed">
                <ChallengeRenderer
                  attemptsRemaining={getChallengeAttemptsRemaining(state, state.currentChallenge)}
                  challenge={currentChallenge}
                  disabled={isPuzzleOver(state)}
                  onSubmit={handleChallengeSubmit}
                />
              </Card>
            </FadeIn>

            <FadeIn delay={0.5}>
              <Card title="Final System Decryption">
                <form className="space-y-4" onSubmit={handleFinalGuess}>
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <p className="text-xs uppercase tracking-widest text-secondary font-bold">Final Input</p>
                    <Badge variant="outline">Lives: {state.answerLives}</Badge>
                  </div>
                  <div className="relative">
                    <Input
                      className="pr-12"
                      disabled={state.solved || state.failed}
                      onChange={(event) => setAnswerInput(event.target.value)}
                      placeholder={puzzle.display}
                      value={answerInput}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/50">
                      <Zap size={18} />
                    </div>
                  </div>
                  <Button
                    className="w-full py-4"
                    disabled={state.solved || state.failed}
                    type="submit"
                  >
                    Submit System Answer
                    <ChevronRight size={18} />
                  </Button>
                </form>
              </Card>
            </FadeIn>
          </div>

          <aside className="space-y-6">
            <FadeIn delay={0.6}>
              <Card title="System State">
                <div className="grid gap-3 text-sm text-secondary">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-muted transition-colors">
                    <span className="flex items-center gap-2"><Activity size={14} /> Hints</span>
                    <span className="font-bold text-on-surface">{state.hintsUnlocked}/5</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-muted transition-colors">
                    <span className="flex items-center gap-2"><Zap size={14} /> Failures</span>
                    <span className="font-bold text-on-surface">{state.failedChallenges.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-muted transition-colors">
                    <span className="flex items-center gap-2"><Trophy size={14} /> Zero-Fail Bonus</span>
                    <span className="font-bold text-on-surface">{state.failedChallenges.length === 0 ? "+2" : "0"}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-muted transition-colors">
                    <span className="flex items-center gap-2"><Timer size={14} /> Started</span>
                    <span className="font-bold text-on-surface">{new Date(state.timeStarted).toLocaleTimeString()}</span>
                  </div>
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.7}>
              <Card title="Console Output">
                <div className="p-4 rounded-xl bg-[#0f172a] text-slate-300 font-mono text-sm italic border border-slate-700 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary/30 animate-pulse"></div>
                  {state.currentRoast || statusMessage}
                </div>
              </Card>
            </FadeIn>

            <FadeIn delay={0.8}>
              <Card title="Session Info" subtitle="Local storage sync active">
                <p className="text-sm text-secondary leading-relaxed">
                  Local state persists automatically. Archive is captured when the puzzle resolves.
                </p>
                <div className="mt-4 p-3 rounded-lg bg-surface-muted text-xs text-secondary italic border border-surface-outline">
                  Judge0 execution and sharing are next in xl build order.
                </div>
              </Card>
            </FadeIn>
          </aside>
        </main>
      </div>
    </div>
  );
}
