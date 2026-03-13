// app.js — Orchestrator: navigation, lifecycle, event wiring
// Phase 2c: i18n framework, UI + learning language switchers (en + de + uk)

import * as tts from './tts.js';
import * as game from './game.js';
import * as ui from './ui.js';
import * as storage from './storage.js';
import { CATEGORY_GROUPS, CATEGORY_META } from './categories.js';
import {
  initI18n, t, applyTranslations, getUILang, setUILang,
  getLearnLang, setLearnLang, getCategoryLabel, getCategoryDesc, getGroupLabel,
} from './i18n.js';

// ── Constants ──────────────────────────────────────────────────────────────

const AUTO_ADVANCE_DELAY_MS = 1500;
const WRONG_REPLAY_DELAY_MS = 500;

// ── State ──────────────────────────────────────────────────────────────────

let currentSpeed = 'normal';
let lastMode = null;
let ttsReady = false;
let currentTheme = 'auto';
let sessionLength = 10;

// ── Initialization ─────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize i18n FIRST (before any UI rendering)
  initI18n();

  ui.initScreens();

  // Load saved preferences
  currentSpeed = storage.get('speed', 'normal');
  ui.setActiveSpeed(currentSpeed);

  currentTheme = storage.get('theme', 'auto');
  applyTheme(currentTheme);

  sessionLength = storage.get('sessionLength', 10);
  ui.setActiveSessionLength(sessionLength);

  // Initialize TTS
  ttsReady = await tts.init();

  if (!ttsReady && !tts.hasVoiceForLearnLang()) {
    const learnLang = getLearnLang();
    if (learnLang === 'uk' && tts.hasNoUkrainianVoice()) {
      ui.showError(t('toast.no_voice_uk'));
    } else if (learnLang === 'de' && tts.hasNoGermanVoice()) {
      ui.showError(t('toast.no_voice_de'));
    } else if (tts.hasNoEnglishVoice()) {
      ui.showError(t('toast.no_voice_en'));
    }
  }

  tts.onInterrupt(() => {});

  // Build category menu
  renderCategoryGroups();

  // Wire up all event handlers
  wireOnboarding();
  wireMenu();
  wireTraining();
  wireSummary();
  wireSpeedControls();
  wireThemeToggle();
  wireSessionLength();
  wireBackButton();
  wireError();
  wireLanguageSwitchers();

  // Apply i18n translations to static elements
  applyTranslations();

  // Decide which screen to show
  const onboarded = storage.get('onboarded', false);
  if (!onboarded) {
    ui.showScreen('onboarding');
  } else {
    ui.showScreen('menu');
  }

  registerSW();
});

// ── Service Worker Registration ────────────────────────────────────────────

/**
 * Register the service worker for offline PWA support.
 */
function registerSW() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
}

// ── Theme ──────────────────────────────────────────────────────────────────

/**
 * Apply a theme to the document.
 * @param {string} theme - 'auto' | 'light' | 'dark'
 */
function applyTheme(theme) {
  document.documentElement.removeAttribute('data-theme');
  if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
  else if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');

  storage.set('theme', theme);
  ui.updateThemeIcon(theme);

  const isDark = theme === 'dark' ||
    (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const color = isDark ? '#1c1c1e' : '#f5f5f7';
  document.querySelectorAll('meta[name="theme-color"]').forEach(m => {
    m.setAttribute('content', color);
  });
}

/**
 * Wire the theme toggle button.
 */
function wireThemeToggle() {
  const btn = document.getElementById('btn-theme');
  if (btn) {
    btn.addEventListener('click', () => {
      currentTheme = ui.nextTheme(currentTheme);
      applyTheme(currentTheme);
      ui.showToast(t('theme.' + currentTheme));
    });
  }
}

/**
 * Wire session length buttons.
 */
function wireSessionLength() {
  document.querySelectorAll('.session-length-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sessionLength = parseInt(btn.dataset.length, 10);
      storage.set('sessionLength', sessionLength);
      ui.setActiveSessionLength(sessionLength);
    });
  });
}

/**
 * Wire back button on training screen.
 */
function wireBackButton() {
  const btn = document.getElementById('btn-back');
  if (btn) {
    btn.addEventListener('click', () => {
      tts.stop();
      game.endSession();
      ui.showScreen('menu');
    });
  }
}

// ── Language Switchers ─────────────────────────────────────────────────────

/**
 * Wire UI language and learning language switcher buttons.
 */
function wireLanguageSwitchers() {
  // UI language buttons
  document.querySelectorAll('.ui-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newLang = btn.dataset.lang;
      setUILang(newLang);
      updateLangButtonStates();
      // Re-render category menu with new language
      renderCategoryGroups();
    });
  });

  // Learning language buttons
  document.querySelectorAll('.learn-lang-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const newLang = btn.dataset.lang;
      setLearnLang(newLang);
      updateLangButtonStates();

      // Check voice availability for new learning language
      if (!tts.hasVoiceForLearnLang()) {
        if (newLang === 'uk') {
          ui.showToast(t('toast.no_voice_uk'));
        } else if (newLang === 'de') {
          ui.showToast(t('toast.no_voice_de'));
        } else {
          ui.showToast(t('toast.no_voice_en'));
        }
      }

      // Re-render category menu (descriptions change per learning language)
      renderCategoryGroups();
    });
  });

  // Set initial button states
  updateLangButtonStates();
}

/**
 * Update active states on all language switcher buttons.
 */
function updateLangButtonStates() {
  const uiLang = getUILang();
  const learnLang = getLearnLang();

  document.querySelectorAll('.ui-lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === uiLang);
  });

  document.querySelectorAll('.learn-lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === learnLang);
  });
}

// ── Category group rendering ───────────────────────────────────────────────

/**
 * Build the grouped category menu dynamically.
 * Uses i18n for group labels, category names, and descriptions.
 */
function renderCategoryGroups() {
  const container = document.getElementById('category-groups');
  if (!container) return;
  container.innerHTML = '';

  for (const group of CATEGORY_GROUPS) {
    const groupEl = document.createElement('div');
    groupEl.className = 'category-group';

    const label = document.createElement('div');
    label.className = 'category-group-label';
    label.textContent = getGroupLabel(group.id);
    groupEl.appendChild(label);

    const grid = document.createElement('div');
    grid.className = 'category-grid';
    if (group.categories.length === 1) {
      grid.classList.add('category-grid--single');
    }

    for (const catId of group.categories) {
      const meta = CATEGORY_META[catId];
      if (!meta) continue;

      const btn = document.createElement('button');
      btn.className = 'mode-btn';
      btn.dataset.mode = catId;
      btn.innerHTML = `<span class="mode-icon" aria-hidden="true">${meta.icon}</span>` +
        `<span>${getCategoryLabel(catId)}</span><br><small>${getCategoryDesc(catId)}</small>`;

      btn.addEventListener('click', () => {
        if (!ttsReady && !tts.hasVoiceForLearnLang()) {
          ui.showError(t('error.message'));
          return;
        }
        startTraining(catId);
      });

      grid.appendChild(btn);
    }

    groupEl.appendChild(grid);
    container.appendChild(groupEl);
  }
}

// ── Onboarding ─────────────────────────────────────────────────────────────

/**
 * Wire the onboarding screen start button.
 */
function wireOnboarding() {
  const btnStart = document.getElementById('btn-onboarding-start');
  if (btnStart) {
    btnStart.addEventListener('click', () => {
      storage.set('onboarded', true);
      if (ttsReady) tts.warmUp();
      ui.showScreen('menu');
    });
  }
}

// ── Menu ───────────────────────────────────────────────────────────────────

/**
 * Wire the menu screen.
 */
function wireMenu() {
  const btnHelp = document.getElementById('btn-help');
  if (btnHelp) {
    btnHelp.addEventListener('click', () => ui.showScreen('onboarding'));
  }
}

// ── Training ───────────────────────────────────────────────────────────────

/**
 * Start a training session for the given mode.
 * @param {string} mode
 */
function startTraining(mode) {
  lastMode = mode;
  game.startSession(mode);
  ui.showScreen('training');
  ui.showCategoryIndicator(mode);
  ui.updateScore(0, 0);
  playNextRound();
}

/**
 * Play the next round: generate target, render options, speak.
 */
function playNextRound() {
  const round = game.nextRound();
  ui.clearFeedback();
  ui.showNextButton(false);
  ui.showSkipButton(true);

  ui.renderOptions(round.options, handleAnswer);
  speakCurrent();
}

/**
 * Handle a user answer selection.
 * @param {string} selectedDisplay
 * @param {number} buttonIndex
 */
function handleAnswer(selectedDisplay, buttonIndex) {
  const result = game.submitAnswer(selectedDisplay);
  if (!result) return;

  const score = game.getScore();
  ui.updateScore(score.correct, score.total);

  if (sessionLength > 0 && score.total >= sessionLength) {
    ui.showCorrect(result.correctIndex);
    if (!result.isCorrect) ui.showWrong(buttonIndex, result.correctIndex);
    ui.showSkipButton(false);
    setTimeout(() => {
      tts.stop();
      const stats = game.endSession();
      ui.showSummary(stats);
    }, AUTO_ADVANCE_DELAY_MS);
    return;
  }

  if (result.isCorrect) {
    ui.showCorrect(result.correctIndex);
    ui.showSkipButton(false);
    setTimeout(() => playNextRound(), AUTO_ADVANCE_DELAY_MS);
  } else {
    ui.showWrong(buttonIndex, result.correctIndex);
    ui.showSkipButton(false);
    ui.showNextButton(true);
    setTimeout(() => speakCurrent(), WRONG_REPLAY_DELAY_MS);
  }
}

/**
 * Speak the current sentence via TTS.
 */
function speakCurrent() {
  const sentence = game.getCurrentSentence();
  tts.speak(sentence, currentSpeed).catch(err => {
    if (err.message === 'offline') {
      ui.showOfflineWarning();
    } else if (err.message === 'tts_error') {
      ui.showToast(t('toast.tts_failed'));
    }
  });
}

/**
 * Wire all training screen buttons.
 */
function wireTraining() {
  const btnReplay = document.getElementById('btn-replay');
  if (btnReplay) {
    btnReplay.addEventListener('click', () => speakCurrent());
  }

  const btnSkip = document.getElementById('btn-skip');
  if (btnSkip) {
    btnSkip.addEventListener('click', () => {
      const result = game.skipRound();
      if (!result) return;

      const score = game.getScore();
      ui.updateScore(score.correct, score.total);
      ui.lockButtons();
      ui.showCorrect(result.correctIndex);
      ui.showSkipButton(false);

      setTimeout(() => playNextRound(), AUTO_ADVANCE_DELAY_MS);
    });
  }

  const btnNext = document.getElementById('btn-next');
  if (btnNext) {
    btnNext.addEventListener('click', () => playNextRound());
  }

  const btnEnd = document.getElementById('btn-end');
  if (btnEnd) {
    btnEnd.addEventListener('click', () => {
      tts.stop();
      const stats = game.endSession();
      ui.showSummary(stats);
    });
  }
}

// ── Summary ────────────────────────────────────────────────────────────────

/**
 * Wire the summary screen buttons.
 */
function wireSummary() {
  const btnNewSession = document.getElementById('btn-new-session');
  if (btnNewSession) {
    btnNewSession.addEventListener('click', () => {
      if (lastMode) {
        startTraining(lastMode);
      } else {
        ui.showScreen('menu');
      }
    });
  }

  const btnHome = document.getElementById('btn-home');
  if (btnHome) {
    btnHome.addEventListener('click', () => ui.showScreen('menu'));
  }
}

// ── Speed controls ─────────────────────────────────────────────────────────

/**
 * Wire speed control buttons.
 */
function wireSpeedControls() {
  document.querySelectorAll('.speed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentSpeed = btn.dataset.speed;
      storage.set('speed', currentSpeed);
      ui.setActiveSpeed(currentSpeed);
    });
  });
}

// ── Error screen ───────────────────────────────────────────────────────────

/**
 * Wire the error screen retry button.
 */
function wireError() {
  const btnRetry = document.getElementById('btn-error-retry');
  if (btnRetry) {
    btnRetry.addEventListener('click', async () => {
      ttsReady = await tts.init();
      if (ttsReady && tts.hasVoiceForLearnLang()) {
        ui.showScreen('menu');
      } else {
        ui.showError(t('toast.tts_still_unavailable'));
      }
    });
  }
}
