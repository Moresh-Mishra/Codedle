const STORAGE_PREFIX = "codedle.game.v1";
const ARCHIVE_KEY = "codedle.archive.v1";

const SCORE_BY_HINTS = {
  1: 10,
  2: 5,
  3: 4,
  4: 2,
  5: 1,
};

function safeRead(key, fallbackValue) {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallbackValue;
  } catch (error) {
    return fallbackValue;
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Ignore storage failures in restricted browser environments.
  }
}

export function normalizeAnswer(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function getPuzzleStorageKey(puzzleId, userId = "guest") {
  return `${STORAGE_PREFIX}.${userId}.${puzzleId}`;
}

export function formatPattern(pattern) {
  return pattern.map((length) => "_".repeat(length)).join(" ");
}

export function createInitialGameState(puzzle, userId = "guest") {
  return {
    sessionOwnerId: userId,
    puzzleId: puzzle.id,
    currentChallenge: 0,
    hintsUnlocked: 0,
    answerMode: false,
    challengeAttempts: Array.from({ length: 5 }, () => 5),
    answerLives: 3,
    solved: false,
    failed: false,
    score: null,
    timeStarted: new Date().toISOString(),
    timeFinished: null,
    failedChallenges: [],
    wrongGuessCount: 0,
    shownRoasts: [],
    currentRoast: "",
  };
}

export function loadGameState(puzzle, userId = "guest") {
  const storedState = safeRead(getPuzzleStorageKey(puzzle.id, userId), null);

  if (!storedState || storedState.puzzleId !== puzzle.id || storedState.sessionOwnerId !== userId) {
    return createInitialGameState(puzzle, userId);
  }

  return {
    ...createInitialGameState(puzzle, userId),
    ...storedState,
    challengeAttempts: Array.isArray(storedState.challengeAttempts)
      ? storedState.challengeAttempts
      : Array.from({ length: 5 }, () => 5),
    failedChallenges: Array.isArray(storedState.failedChallenges) ? storedState.failedChallenges : [],
    shownRoasts: Array.isArray(storedState.shownRoasts) ? storedState.shownRoasts : [],
  };
}

export function saveGameState(state) {
  if (!state?.puzzleId) {
    return;
  }

  safeWrite(getPuzzleStorageKey(state.puzzleId, state.sessionOwnerId), state);
}

export function archiveGameState(state) {
  if (!state?.puzzleId) {
    return;
  }

  const archive = safeRead(ARCHIVE_KEY, []);
  const nextArchive = [
    ...archive.filter((entry) => entry.puzzleId !== state.puzzleId),
    { ...state, archivedAt: new Date().toISOString() },
  ];

  safeWrite(ARCHIVE_KEY, nextArchive);
}

export function calculateScore({ hintsUnlocked, zeroFailedChallenges }) {
  const baseScore = SCORE_BY_HINTS[hintsUnlocked] ?? 0;

  if (baseScore === 0) {
    return 0;
  }

  return zeroFailedChallenges ? baseScore + 2 : baseScore;
}

export function createRoastPicker(roasts, usedRoasts = []) {
  return {
    pick() {
      const availableRoasts = roasts.filter((roast) => !usedRoasts.includes(roast));
      const pool = availableRoasts.length > 0 ? availableRoasts : roasts;

      if (pool.length === 0) {
        return "No roast bank configured.";
      }

      return pool[Math.floor(Math.random() * pool.length)];
    },
  };
}

export function challengeMatches(challenge, submission) {
  if (!challenge) {
    return false;
  }

  if (challenge.type === "output_prediction") {
    return String(submission ?? "").trim() === String(challenge.answer ?? "").trim();
  }

  if (challenge.type === "reorder_lines") {
    if (Array.isArray(submission)) {
      return JSON.stringify(submission) === JSON.stringify(challenge.answer);
    }

    const normalizedSubmission = String(submission ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    return JSON.stringify(normalizedSubmission) === JSON.stringify(challenge.answer);
  }

  return normalizeAnswer(submission) === normalizeAnswer(challenge.answer);
}

export function answerMatches(puzzle, submission) {
  return normalizeAnswer(submission) === normalizeAnswer(puzzle.answer);
}

export function advanceChallenge(state) {
  const nextHintsUnlocked = Math.min(state.hintsUnlocked + 1, 5);

  return {
    ...state,
    currentChallenge: Math.min(state.currentChallenge + 1, 4),
    hintsUnlocked: nextHintsUnlocked,
    answerMode: nextHintsUnlocked === 5,
  };
}

export function applyChallengeFailure(state, challengeIndex) {
  const nextAttempts = [...state.challengeAttempts];
  nextAttempts[challengeIndex] = Math.max((nextAttempts[challengeIndex] ?? 0) - 1, 0);

  const nextState = {
    ...state,
    challengeAttempts: nextAttempts,
  };

  if (nextAttempts[challengeIndex] === 0) {
    nextState.currentChallenge = Math.min(challengeIndex + 1, 4);
    nextState.failedChallenges = state.failedChallenges.includes(challengeIndex)
      ? state.failedChallenges
      : [...state.failedChallenges, challengeIndex];
    nextState.answerMode = challengeIndex === 4;
  }

  return nextState;
}

export function finishGame(state, puzzle, solved) {
  const nextState = {
    ...state,
    solved,
    failed: !solved,
    timeFinished: new Date().toISOString(),
    score: solved
      ? calculateScore({
          hintsUnlocked: state.hintsUnlocked || 5,
          zeroFailedChallenges: state.failedChallenges.length === 0,
        })
      : 0,
  };

  saveGameState(nextState);
  archiveGameState(nextState);

  return nextState;
}

export function getChallengeAttemptsRemaining(state, challengeIndex) {
  return state.challengeAttempts[challengeIndex] ?? 0;
}

export function isPuzzleOver(state) {
  return state.solved || state.failed;
}

export function readArchivedGames() {
  return safeRead(ARCHIVE_KEY, []);
}
