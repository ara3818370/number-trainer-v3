// tts.js — Web Speech API wrapper with iOS workarounds, offline detection, error handling
// Phase 2c: Multi-language voice selection (English + German + Ukrainian)

import { getLearnLang } from './i18n.js';

// ── Constants ──────────────────────────────────────────────────────────────

const VOICE_WAIT_TIMEOUT_MS = 3000;
const VOICE_POLL_INTERVAL_MS = 250;
const VOICE_POLL_MAX_MS = 3000;

const RATE_MAP = {
  slow: 0.7,
  normal: 1.0,
  fast: 1.3,
};

// ── State ──────────────────────────────────────────────────────────────────

/** @type {SpeechSynthesisVoice|null} */
let selectedEnVoice = null;
/** @type {SpeechSynthesisVoice|null} */
let selectedDeVoice = null;
/** @type {SpeechSynthesisVoice|null} */
let selectedUkVoice = null;
let available = false;
let initialized = false;
let onInterruptCallback = null;
let noEnglishVoiceWarning = false;
let noGermanVoiceWarning = false;
let noUkrainianVoiceWarning = false;

// ── Voice selection ────────────────────────────────────────────────────────

/**
 * Select the best English voice from a list.
 * Priority: Samantha/Daniel → en-US → en-* → null (with warning).
 * @param {SpeechSynthesisVoice[]} voices
 * @returns {SpeechSynthesisVoice|null}
 */
function selectBestEnglishVoice(voices) {
  if (!voices || voices.length === 0) return null;

  const preferred = voices.find(v =>
    /samantha|daniel/i.test(v.name) && v.lang.startsWith('en')
  );
  if (preferred) { noEnglishVoiceWarning = false; return preferred; }

  const enUS = voices.find(v => v.lang === 'en-US');
  if (enUS) { noEnglishVoiceWarning = false; return enUS; }

  const enAny = voices.find(v => v.lang.startsWith('en'));
  if (enAny) { noEnglishVoiceWarning = false; return enAny; }

  noEnglishVoiceWarning = true;
  return null;
}

/**
 * Select the best German voice from a list.
 * Priority: native German voices (Anna/Helena/Petra) → de-DE → de-* → null.
 * @param {SpeechSynthesisVoice[]} voices
 * @returns {SpeechSynthesisVoice|null}
 */
function selectBestGermanVoice(voices) {
  if (!voices || voices.length === 0) return null;

  // Prefer well-known native German voices
  const preferred = voices.find(v =>
    /anna|helena|petra|markus|yannick/i.test(v.name) && v.lang.startsWith('de')
  );
  if (preferred) { noGermanVoiceWarning = false; return preferred; }

  const deDE = voices.find(v => v.lang === 'de-DE');
  if (deDE) { noGermanVoiceWarning = false; return deDE; }

  const deAny = voices.find(v => v.lang.startsWith('de'));
  if (deAny) { noGermanVoiceWarning = false; return deAny; }

  noGermanVoiceWarning = true;
  return null;
}

/**
 * Select the best Ukrainian voice from a list.
 * Priority: native Ukrainian voices → uk-UA → uk-* → null.
 * @param {SpeechSynthesisVoice[]} voices
 * @returns {SpeechSynthesisVoice|null}
 */
function selectBestUkrainianVoice(voices) {
  if (!voices || voices.length === 0) return null;

  // Prefer well-known native Ukrainian voices
  const preferred = voices.find(v =>
    /lesya|лесь|kateryna|катерин|olena|олен|dmytro|дмитр/i.test(v.name) && v.lang.startsWith('uk')
  );
  if (preferred) { noUkrainianVoiceWarning = false; return preferred; }

  const ukUA = voices.find(v => v.lang === 'uk-UA');
  if (ukUA) { noUkrainianVoiceWarning = false; return ukUA; }

  const ukAny = voices.find(v => v.lang.startsWith('uk'));
  if (ukAny) { noUkrainianVoiceWarning = false; return ukAny; }

  noUkrainianVoiceWarning = true;
  return null;
}

/**
 * Get the currently active voice based on learning language.
 * @returns {SpeechSynthesisVoice|null}
 */
function getActiveVoice() {
  const l = getLearnLang();
  if (l === 'uk') return selectedUkVoice;
  if (l === 'de') return selectedDeVoice;
  return selectedEnVoice;
}

// ── Initialization ─────────────────────────────────────────────────────────

/**
 * Initialize TTS: wait for voices, select best voices for all languages.
 * Must be called once at startup. Returns true if TTS is usable.
 * @returns {Promise<boolean>}
 */
export function init() {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      available = false;
      initialized = true;
      resolve(false);
      return;
    }

    /**
     * Process available voices and select best for each language.
     * @param {SpeechSynthesisVoice[]} voices
     */
    function processVoices(voices) {
      selectedEnVoice = selectBestEnglishVoice(voices);
      selectedDeVoice = selectBestGermanVoice(voices);
      selectedUkVoice = selectBestUkrainianVoice(voices);
      // Available if at least one language voice exists
      available = !!(selectedEnVoice || selectedDeVoice || selectedUkVoice);
      initialized = true;
    }

    let voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      processVoices(voices);
      resolve(available);
      return;
    }

    let resolved = false;

    const onVoicesChanged = () => {
      if (resolved) return;
      voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        processVoices(voices);
        resolved = true;
        resolve(available);
      }
    };

    speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);

    let pollElapsed = 0;
    const pollTimer = setInterval(() => {
      pollElapsed += VOICE_POLL_INTERVAL_MS;
      voices = speechSynthesis.getVoices();
      if (voices.length > 0 && !resolved) {
        clearInterval(pollTimer);
        onVoicesChanged();
      }
      if (pollElapsed >= VOICE_POLL_MAX_MS && !resolved) {
        clearInterval(pollTimer);
        voices = speechSynthesis.getVoices();
        processVoices(voices);
        resolved = true;
        resolve(available);
      }
    }, VOICE_POLL_INTERVAL_MS);

    setTimeout(() => {
      if (!resolved) {
        clearInterval(pollTimer);
        voices = speechSynthesis.getVoices();
        processVoices(voices);
        resolved = true;
        resolve(available);
      }
    }, VOICE_WAIT_TIMEOUT_MS);
  });
}

// ── Speak ──────────────────────────────────────────────────────────────────

/**
 * Speak the given text using Web Speech API.
 * Uses the voice appropriate for the current learning language.
 * @param {string} text - Text to speak
 * @param {'slow'|'normal'|'fast'} speed - Speed preset name
 * @returns {Promise<void>} Resolves when speech ends, rejects on error
 */
export function speak(text, speed = 'normal') {
  return new Promise((resolve, reject) => {
    const voice = getActiveVoice();
    if (!available || !voice) {
      reject(new Error('TTS not available'));
      return;
    }

    speechSynthesis.cancel();

    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      const langMap = { de: 'de-DE', uk: 'uk-UA', en: 'en-US' };
      utterance.lang = voice.lang || langMap[getLearnLang()] || 'en-US';
      utterance.rate = RATE_MAP[speed] || 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => resolve();

      utterance.onerror = (event) => {
        if (!navigator.onLine) {
          reject(new Error('offline'));
        } else if (event.error === 'canceled') {
          resolve();
        } else {
          reject(new Error('tts_error'));
        }
      };

      speechSynthesis.speak(utterance);
    }, 100);
  });
}

// ── Warm-up (UX-002) ───────────────────────────────────────────────────────

/**
 * Silent warm-up for iOS: triggers speech in a user gesture handler.
 */
export function warmUp() {
  if (!window.speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(' ');
  utterance.volume = 0;
  const voice = getActiveVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang || 'en-US';
  }
  speechSynthesis.speak(utterance);
}

// ── Stop ───────────────────────────────────────────────────────────────────

/**
 * Stop any ongoing speech.
 */
export function stop() {
  if (window.speechSynthesis) {
    speechSynthesis.cancel();
  }
}

// ── Status ─────────────────────────────────────────────────────────────────

/**
 * Check if TTS is available and initialized.
 * @returns {boolean}
 */
export function isAvailable() {
  return available;
}

/**
 * Get the name of the selected voice for the current learn language.
 * @returns {string}
 */
export function getVoiceName() {
  const voice = getActiveVoice();
  return voice ? `${voice.name} (${voice.lang})` : 'none';
}

/**
 * Check if no English voice was found.
 * @returns {boolean}
 */
export function hasNoEnglishVoice() {
  return noEnglishVoiceWarning;
}

/**
 * Check if no German voice was found.
 * @returns {boolean}
 */
export function hasNoGermanVoice() {
  return noGermanVoiceWarning;
}

/**
 * Check if no Ukrainian voice was found.
 * @returns {boolean}
 */
export function hasNoUkrainianVoice() {
  return noUkrainianVoiceWarning;
}

/**
 * Check if the current learning language has a voice available.
 * @returns {boolean}
 */
export function hasVoiceForLearnLang() {
  return !!getActiveVoice();
}

// ── Visibility change handler ──────────────────────────────────────────────

/**
 * Set a callback for when TTS may have been interrupted by tab switch.
 * @param {function} callback
 */
export function onInterrupt(callback) {
  onInterruptCallback = callback;
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else if (onInterruptCallback) {
      onInterruptCallback();
    }
  });
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => stop());
}
