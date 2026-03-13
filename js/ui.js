// ui.js — DOM manipulation, screen navigation, button rendering, feedback
// Phase 2b: All text uses i18n, category metadata via translation keys

import { CATEGORY_GROUPS, CATEGORY_META } from './categories.js';
import { t, getCategoryLabel, getCategoryDesc, getGroupLabel } from './i18n.js';

// ── Screen management ──────────────────────────────────────────────────────

const screens = {};
let currentScreen = null;

/**
 * Initialize screen references from DOM.
 * Call once after DOMContentLoaded.
 */
export function initScreens() {
  document.querySelectorAll('.screen').forEach(el => {
    screens[el.id.replace('screen-', '')] = el;
  });
}

/**
 * Show a screen by name, hide all others.
 * @param {string} name
 */
export function showScreen(name) {
  for (const [key, el] of Object.entries(screens)) {
    el.classList.toggle('active', key === name);
  }
  currentScreen = name;
}

// ── Category indicator ──────────────────────────────────────────────────

/**
 * Show category name + icon in training header.
 * @param {string} mode - category ID
 */
export function showCategoryIndicator(mode) {
  const el = document.getElementById('category-indicator');
  if (!el) return;
  const meta = CATEGORY_META[mode];
  if (meta) {
    el.textContent = meta.icon + ' ' + getCategoryLabel(mode);
  } else {
    el.textContent = '';
  }
}

// ── Session length ─────────────────────────────────────────────────────────

/**
 * Set the active session length button.
 * @param {number} length - 0 for infinite
 */
export function setActiveSessionLength(length) {
  document.querySelectorAll('.session-length-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.length, 10) === length);
  });
}

// ── Options rendering ──────────────────────────────────────────────────────

let buttonsLocked = false;

/**
 * Render 4 option buttons from CategoryValue objects.
 * @param {object[]} options - Array of 4 CategoryValue objects
 * @param {function} onClick - Callback(display: string, buttonIndex: number)
 */
export function renderOptions(options, onClick) {
  const grid = document.getElementById('options-grid');
  grid.innerHTML = '';
  buttonsLocked = false;

  options.forEach((cv, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    if (cv.display.length > 8) btn.classList.add('long-text');
    btn.textContent = cv.display;
    btn.dataset.display = cv.display;
    btn.dataset.index = index;
    btn.addEventListener('click', () => {
      if (buttonsLocked) return;
      lockButtons();
      onClick(cv.display, index);
    });
    grid.appendChild(btn);
  });
}

// ── Button locking ─────────────────────────────────────────────────────────

/**
 * Lock all option buttons to prevent double-tap.
 */
export function lockButtons() {
  buttonsLocked = true;
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = true;
  });
}

/**
 * Unlock all option buttons.
 */
export function unlockButtons() {
  buttonsLocked = false;
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.disabled = false;
  });
}

// ── Feedback ───────────────────────────────────────────────────────────────

/**
 * Show correct answer feedback (green highlight).
 * @param {number} correctIndex
 */
export function showCorrect(correctIndex) {
  const buttons = document.querySelectorAll('.option-btn');
  if (buttons[correctIndex]) {
    buttons[correctIndex].classList.add('correct');
  }
}

/**
 * Show wrong answer feedback.
 * @param {number} selectedIndex
 * @param {number} correctIndex
 */
export function showWrong(selectedIndex, correctIndex) {
  const buttons = document.querySelectorAll('.option-btn');
  if (buttons[selectedIndex]) {
    buttons[selectedIndex].classList.add('wrong');
  }
  if (buttons[correctIndex]) {
    buttons[correctIndex].classList.add('correct');
  }
}

/**
 * Clear all feedback classes from option buttons.
 */
export function clearFeedback() {
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.classList.remove('correct', 'wrong');
  });
}

// ── Score display ──────────────────────────────────────────────────────────

/**
 * Update the score counter display.
 * @param {number} correct
 * @param {number} total
 */
export function updateScore(correct, total) {
  const el = document.getElementById('score-display');
  if (el) {
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    el.textContent = `${correct}/${total} — ${pct}%`;
  }
}

// ── Summary screen ─────────────────────────────────────────────────────────

/**
 * Show summary screen with session results.
 * @param {{ correct: number, total: number, percent: number, mode: string }} stats
 */
export function showSummary(stats) {
  document.getElementById('summary-correct').textContent = stats.correct;
  document.getElementById('summary-total').textContent = stats.total;
  document.getElementById('summary-percent').textContent = stats.percent + '%';

  const meta = CATEGORY_META[stats.mode];
  const label = meta ? getCategoryLabel(stats.mode) : stats.mode;
  document.getElementById('summary-mode').textContent = label;

  const catEl = document.getElementById('summary-category');
  if (catEl && meta) {
    catEl.textContent = meta.icon + ' ' + label;
  }

  const btnNew = document.getElementById('btn-new-session');
  if (btnNew && meta) {
    btnNew.textContent = t('summary.again') + ' ' + label;
  }

  showScreen('summary');
}

// ── Error display ──────────────────────────────────────────────────────────

/**
 * Show a TTS error message.
 * @param {string} message
 */
export function showError(message) {
  const el = document.getElementById('error-message');
  if (el) el.textContent = message;
  showScreen('error');
}

/**
 * Show an inline warning toast.
 * @param {string} message
 */
export function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 3000);
}

/**
 * Show offline warning for TTS.
 */
export function showOfflineWarning() {
  showToast(t('toast.offline'));
}

// ── Next button visibility ─────────────────────────────────────────────────

/**
 * Show or hide the Next button.
 * @param {boolean} visible
 */
export function showNextButton(visible) {
  const btn = document.getElementById('btn-next');
  if (btn) btn.classList.toggle('hidden', !visible);
}

/**
 * Show or hide the Skip button.
 * @param {boolean} visible
 */
export function showSkipButton(visible) {
  const btn = document.getElementById('btn-skip');
  if (btn) btn.classList.toggle('hidden', !visible);
}

// ── Speed control ──────────────────────────────────────────────────────────

/**
 * Set the active state on speed buttons.
 * @param {string} speed
 */
export function setActiveSpeed(speed) {
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.speed === speed);
  });
}

// ── Theme ──────────────────────────────────────────────────────────────────

const THEME_ICONS = { auto: '🌓', light: '☀️', dark: '🌙' };
const THEME_CYCLE = ['auto', 'light', 'dark'];

/**
 * Update the theme toggle button icon.
 * @param {string} theme
 */
export function updateThemeIcon(theme) {
  const btn = document.getElementById('btn-theme');
  if (btn) btn.textContent = THEME_ICONS[theme] || '🌓';
}

/**
 * Get the next theme in the cycle.
 * @param {string} current
 * @returns {string}
 */
export function nextTheme(current) {
  const idx = THEME_CYCLE.indexOf(current);
  return THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
}
