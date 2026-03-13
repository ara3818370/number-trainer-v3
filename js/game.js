// game.js — Session and round logic, score tracking
// v2: Uses CategoryValue interface instead of plain numbers

import { getGenerator, getSentence } from './categories.js';
import { generateConfusers } from './confuser.js';

// ── Session state ──────────────────────────────────────────────────────────

let state = {
  mode: 'cardinals',
  round: 0,
  correct: 0,
  total: 0,
  currentTarget: null,
  currentSentence: '',
  currentOptions: [],
  answered: false,
};

// ── Shuffle utility ────────────────────────────────────────────────────────

/**
 * Fisher-Yates shuffle.
 * @param {Array} arr
 * @returns {Array}
 */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Start a new training session.
 * @param {string} mode - Category ID
 */
export function startSession(mode) {
  state = {
    mode,
    round: 0,
    correct: 0,
    total: 0,
    currentTarget: null,
    currentSentence: '',
    currentOptions: [],
    answered: false,
  };
}

/**
 * Generate the next round: target value, confusers, sentence.
 * @returns {{ target: object, options: object[], sentence: string }}
 */
export function nextRound() {
  const generator = getGenerator(state.mode);
  const target = generator.generate();
  const confusers = generateConfusers(target);
  const sentence = getSentence(target);
  const options = shuffle([target, ...confusers]);

  state.round++;
  state.currentTarget = target;
  state.currentSentence = sentence;
  state.currentOptions = options;
  state.answered = false;

  return { target, options, sentence };
}

/**
 * Submit an answer and check if it's correct.
 * Compares by display string for reliable equality.
 * @param {string} selectedDisplay - The display string the user chose
 * @returns {{ isCorrect: boolean, correctDisplay: string, correctIndex: number }|null}
 */
export function submitAnswer(selectedDisplay) {
  if (state.answered) return null;

  state.answered = true;
  state.total++;
  const isCorrect = selectedDisplay === state.currentTarget.display;
  if (isCorrect) state.correct++;

  const correctIndex = state.currentOptions.findIndex(
    o => o.display === state.currentTarget.display
  );

  return { isCorrect, correctDisplay: state.currentTarget.display, correctIndex };
}

/**
 * Skip the current round (counts as wrong).
 * @returns {{ correctDisplay: string, correctIndex: number }|null}
 */
export function skipRound() {
  if (state.answered) return null;

  state.answered = true;
  state.total++;
  const correctIndex = state.currentOptions.findIndex(
    o => o.display === state.currentTarget.display
  );

  return { correctDisplay: state.currentTarget.display, correctIndex };
}

/**
 * Get the current sentence (for replay / TTS).
 * @returns {string}
 */
export function getCurrentSentence() {
  return state.currentSentence;
}

/**
 * Get the current score.
 * @returns {{ correct: number, total: number, percent: number }}
 */
export function getScore() {
  const percent = state.total > 0 ? Math.round((state.correct / state.total) * 100) : 0;
  return { correct: state.correct, total: state.total, percent };
}

/**
 * End the session and return final stats.
 * @returns {{ correct: number, total: number, percent: number, mode: string }}
 */
export function endSession() {
  const percent = state.total > 0 ? Math.round((state.correct / state.total) * 100) : 0;
  return {
    correct: state.correct,
    total: state.total,
    percent,
    mode: state.mode,
  };
}
