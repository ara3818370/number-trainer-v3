// i18n.js — Lightweight internationalization framework
// Phase 2c: English + German + Ukrainian

// ── Translation dictionary ─────────────────────────────────────────────────

/**
 * All UI strings keyed by dotted path, with 'en', 'de', and 'uk' translations.
 * @type {Object<string, {en: string, de: string, uk: string}>}
 */
const TRANSLATIONS = {
  // ── Onboarding ──────────────────────────────────────────────────────────
  'onboarding.title':    { en: 'Number Trainer', de: 'Zahlentrainer', uk: 'Тренажер чисел' },
  'onboarding.subtitle': { en: 'Learn to recognize numbers by ear', de: 'Lerne Zahlen nach Gehör zu erkennen', uk: 'Вчись розпізнавати числа на слух' },
  'onboarding.step1':    { en: 'Listen to a sentence', de: 'Höre einen Satz', uk: 'Послухай речення' },
  'onboarding.step2':    { en: 'Choose the number you heard', de: 'Wähle die Zahl, die du gehört hast', uk: 'Обери число, яке почув' },
  'onboarding.step3':    { en: 'Get feedback and keep training', de: 'Erhalte Feedback und trainiere weiter', uk: 'Отримай результат і тренуйся далі' },
  'onboarding.start':    { en: 'Start', de: 'Starten', uk: 'Почати' },

  // ── Menu ────────────────────────────────────────────────────────────────
  'menu.title':          { en: 'Choose a category', de: 'Wähle eine Kategorie', uk: 'Обери категорію' },

  // ── Category group labels ───────────────────────────────────────────────
  'group.basic':         { en: 'Basic', de: 'Grundlagen', uk: 'Основи' },
  'group.context':       { en: 'Numbers in context', de: 'Zahlen im Kontext', uk: 'Числа в контексті' },
  'group.realworld':     { en: 'Real-world', de: 'Alltag', uk: 'Побут' },
  'group.challenge':     { en: 'Challenge', de: 'Herausforderung', uk: 'Виклик' },

  // ── Category names ──────────────────────────────────────────────────────
  'cat.cardinals.label':    { en: 'Cardinals', de: 'Grundzahlen', uk: 'Кількісні' },
  'cat.cardinals.desc':     { en: '1 – 100', de: '1 – 100', uk: '1 – 100' },
  'cat.ordinals.label':     { en: 'Ordinals', de: 'Ordnungszahlen', uk: 'Порядкові' },
  'cat.ordinals.desc':      { en: '1st – 100th', de: '1. – 100.', uk: '1-й – 100-й' },
  'cat.years.label':        { en: 'Years', de: 'Jahre', uk: 'Роки' },
  'cat.years.desc':         { en: '1200 – 2026', de: '1200 – 2026', uk: '1200 – 2026' },
  'cat.fractions.label':    { en: 'Fractions', de: 'Brüche', uk: 'Дроби' },
  'cat.fractions.desc':     { en: '1/2, 3/4, 2 1/3', de: '1/2, 3/4, 2 1/3', uk: '1/2, 3/4, 2 1/3' },
  'cat.decimals.label':     { en: 'Decimals', de: 'Dezimalzahlen', uk: 'Десяткові' },
  'cat.decimals.desc':      { en: '0.01 – 99.99', de: '0,01 – 99,99', uk: '0,01 – 99,99' },
  'cat.currencies.label':   { en: 'Currencies', de: 'Währungen', uk: 'Валюти' },
  'cat.currencies.desc':    { en: '$0.01 – $999.99', de: '€0,01 – €999,99', uk: '₴0,01 – ₴999,99' },
  'cat.percentages.label':  { en: 'Percentages', de: 'Prozent', uk: 'Відсотки' },
  'cat.percentages.desc':   { en: '0.01% – 100%', de: '0,01% – 100%', uk: '0,01% – 100%' },
  'cat.roomBus.label':      { en: 'Room / Bus', de: 'Raum / Bus', uk: 'Кімната / Автобус' },
  'cat.roomBus.desc':       { en: 'Room 101, Bus 305', de: 'Raum 101, Bus 305', uk: 'Кімната 101, Автобус 305' },
  'cat.sports.label':       { en: 'Sports', de: 'Sport', uk: 'Спорт' },
  'cat.sports.desc':        { en: '5:0, 2:1', de: '5:0, 2:1', uk: '5:0, 2:1' },
  'cat.temperatures.label': { en: 'Temperatures', de: 'Temperaturen', uk: 'Температури' },
  'cat.temperatures.desc':  { en: '-30°C – 45°C', de: '-30°C – 45°C', uk: '-30°C – 45°C' },
  'cat.large.label':        { en: 'Large Numbers', de: 'Große Zahlen', uk: 'Великі числа' },
  'cat.large.desc':         { en: '100 – 999,999', de: '100 – 999.999', uk: '100 – 999 999' },
  'cat.mixed.label':        { en: 'Mixed', de: 'Gemischt', uk: 'Мікс' },
  'cat.mixed.desc':         { en: 'all together', de: 'alles zusammen', uk: 'все разом' },

  // ── Speed controls ──────────────────────────────────────────────────────
  'speed.label':   { en: 'Speed:', de: 'Tempo:', uk: 'Швидкість:' },
  'speed.slow':    { en: 'Slow', de: 'Langsam', uk: 'Повільно' },
  'speed.normal':  { en: 'Normal', de: 'Normal', uk: 'Нормально' },
  'speed.fast':    { en: 'Fast', de: 'Schnell', uk: 'Швидко' },

  // ── Session length ──────────────────────────────────────────────────────
  'session.length.label': { en: 'Questions:', de: 'Fragen:', uk: 'Питань:' },

  // ── Training screen ─────────────────────────────────────────────────────
  'training.replay': { en: '🔊 Replay', de: '🔊 Wiederholen', uk: '🔊 Повторити' },
  'training.skip':   { en: 'Skip', de: 'Überspringen', uk: 'Пропустити' },
  'training.next':   { en: 'Next', de: 'Weiter', uk: 'Далі' },
  'training.end':    { en: 'End', de: 'Beenden', uk: 'Завершити' },

  // ── Summary screen ──────────────────────────────────────────────────────
  'summary.title':   { en: 'Result', de: 'Ergebnis', uk: 'Результат' },
  'summary.correct': { en: 'Correct:', de: 'Richtig:', uk: 'Правильно:' },
  'summary.mode':    { en: 'Mode:', de: 'Modus:', uk: 'Режим:' },
  'summary.new':     { en: 'New session', de: 'Neue Sitzung', uk: 'Нова сесія' },
  'summary.home':    { en: 'Home', de: 'Startseite', uk: 'Головна' },
  'summary.again':   { en: '🔄 Again:', de: '🔄 Nochmal:', uk: '🔄 Ще раз:' },

  // ── Error screen ────────────────────────────────────────────────────────
  'error.title':   { en: 'Speech problem', de: 'Sprachproblem', uk: 'Проблема з мовленням' },
  'error.message': { en: 'Your browser does not support speech synthesis. We recommend Safari on iPhone or Chrome on Android.', de: 'Ihr Browser unterstützt keine Sprachsynthese. Wir empfehlen Safari auf dem iPhone oder Chrome auf Android.', uk: 'Ваш браузер не підтримує синтез мовлення. Рекомендуємо Safari на iPhone або Chrome на Android.' },
  'error.retry':   { en: 'Try again', de: 'Erneut versuchen', uk: 'Спробувати знову' },

  // ── Theme toast ─────────────────────────────────────────────────────────
  'theme.auto':  { en: 'Theme: auto', de: 'Thema: automatisch', uk: 'Тема: авто' },
  'theme.light': { en: 'Theme: light', de: 'Thema: hell', uk: 'Тема: світла' },
  'theme.dark':  { en: 'Theme: dark', de: 'Thema: dunkel', uk: 'Тема: темна' },

  // ── Toasts / feedback ───────────────────────────────────────────────────
  'toast.offline':     { en: 'Internet connection needed for speech. Check your connection and try again.', de: 'Internetverbindung für Sprache erforderlich. Prüfe die Verbindung und versuche es erneut.', uk: 'Потрібне з\'єднання з інтернетом для мовлення. Перевірте з\'єднання і спробуйте знову.' },
  'toast.tts_failed':  { en: 'Speech failed. Try again.', de: 'Sprachausgabe fehlgeschlagen. Versuche es erneut.', uk: 'Помилка мовлення. Спробуйте знову.' },
  'toast.no_voice_en': { en: 'No English voice found on your device. Check language settings or install an English voice pack.', de: 'Keine englische Stimme auf dem Gerät gefunden. Spracheinstellungen prüfen oder englisches Sprachpaket installieren.', uk: 'Не знайдено англійський голос на вашому пристрої. Перевірте мовні налаштування або встановіть англійський голосовий пакет.' },
  'toast.no_voice_de': { en: 'No German voice found on your device. Check language settings or install a German voice pack.', de: 'Keine deutsche Stimme auf dem Gerät gefunden. Spracheinstellungen prüfen oder deutsches Sprachpaket installieren.', uk: 'Не знайдено німецький голос на вашому пристрої. Перевірте мовні налаштування або встановіть німецький голосовий пакет.' },
  'toast.no_voice_uk': { en: 'No Ukrainian voice found on your device. Check language settings or install a Ukrainian voice pack.', de: 'Keine ukrainische Stimme auf dem Gerät gefunden. Spracheinstellungen prüfen oder ukrainisches Sprachpaket installieren.', uk: 'Не знайдено український голос на вашому пристрої. Перевірте мовні налаштування або встановіть український голосовий пакет.' },
  'toast.tts_still_unavailable': { en: 'Speech is still unavailable. Reload the page or check your device language settings.', de: 'Sprachausgabe ist weiterhin nicht verfügbar. Seite neu laden oder Spracheinstellungen prüfen.', uk: 'Мовлення досі недоступне. Перезавантажте сторінку або перевірте мовні налаштування.' },

  // ── Language switchers ──────────────────────────────────────────────────
  'lang.ui_label':    { en: 'Interface:', de: 'Oberfläche:', uk: 'Інтерфейс:' },
  'lang.learn_label': { en: 'Learning:', de: 'Lernsprache:', uk: 'Вивчаю:' },
};

// ── State ──────────────────────────────────────────────────────────────────

/** @type {'en'|'de'|'uk'} */
let currentUILang = 'en';
/** @type {'en'|'de'|'uk'} */
let currentLearnLang = 'en';

/** Supported languages */
const SUPPORTED_LANGS = ['en', 'de', 'uk'];

// ── localStorage keys (raw, no prefix — these are their own namespace) ────

const UI_LANG_KEY = 'nlt-ui-lang';
const LEARN_LANG_KEY = 'nlt-learn-lang';

// ── Initialization ─────────────────────────────────────────────────────────

/**
 * Initialize i18n: load saved languages or auto-detect.
 */
export function initI18n() {
  // UI language
  const savedUI = localStorage.getItem(UI_LANG_KEY);
  if (savedUI && SUPPORTED_LANGS.includes(savedUI)) {
    currentUILang = savedUI;
  } else {
    currentUILang = detectBrowserLanguage();
  }

  // Learning language
  const savedLearn = localStorage.getItem(LEARN_LANG_KEY);
  if (savedLearn && SUPPORTED_LANGS.includes(savedLearn)) {
    currentLearnLang = savedLearn;
  } else {
    currentLearnLang = 'en';
  }
}

/**
 * Detect browser language and map to supported UI language.
 * @returns {'en'|'de'}
 */
function detectBrowserLanguage() {
  const lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
  if (lang.startsWith('uk')) return 'uk';
  if (lang.startsWith('de')) return 'de';
  return 'en';
}

// ── Translation function ───────────────────────────────────────────────────

/**
 * Get a translated string for the current UI language.
 * @param {string} key - Dotted translation key (e.g. 'menu.title')
 * @param {string} [lang] - Override language (defaults to current UI lang)
 * @returns {string} Translated string, or the key itself if not found
 */
export function t(key, lang) {
  const useLang = lang || currentUILang;
  const entry = TRANSLATIONS[key];
  if (!entry) return key;
  return entry[useLang] || entry['en'] || key;
}

// ── Language getters/setters ───────────────────────────────────────────────

/**
 * Get the current UI language.
 * @returns {'en'|'de'|'uk'}
 */
export function getUILang() {
  return currentUILang;
}

/**
 * Set the UI language and persist to localStorage.
 * @param {'en'|'de'|'uk'} lang
 */
export function setUILang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  currentUILang = lang;
  localStorage.setItem(UI_LANG_KEY, lang);
  applyTranslations();
}

/**
 * Get the current learning language.
 * @returns {'en'|'de'|'uk'}
 */
export function getLearnLang() {
  return currentLearnLang;
}

/**
 * Set the learning language and persist to localStorage.
 * @param {'en'|'de'|'uk'} lang
 */
export function setLearnLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;
  currentLearnLang = lang;
  localStorage.setItem(LEARN_LANG_KEY, lang);
}

// ── DOM translation application ────────────────────────────────────────────

/**
 * Apply translations to all elements with data-i18n attributes.
 * Also updates the html lang attribute.
 */
export function applyTranslations() {
  document.documentElement.lang = currentUILang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key);
    if (translated !== key) {
      el.textContent = translated;
    }
  });
}

/**
 * Get category label for a given category ID (translated).
 * @param {string} catId
 * @returns {string}
 */
export function getCategoryLabel(catId) {
  return t('cat.' + catId + '.label');
}

/**
 * Get category description for a given category ID (translated).
 * @param {string} catId
 * @returns {string}
 */
export function getCategoryDesc(catId) {
  return t('cat.' + catId + '.desc');
}

/**
 * Get group label for a given group ID (translated).
 * @param {string} groupId
 * @returns {string}
 */
export function getGroupLabel(groupId) {
  return t('group.' + groupId);
}
