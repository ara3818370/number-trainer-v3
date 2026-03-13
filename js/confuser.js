// confuser.js — Confuser generation v2c
// Language-aware: uses the same language-dispatching functions from categories.js
// At least 2 of 4 options (target + 3 confusers) must share the same last digit

import {
  cardinalToWords as enCardinal, ordinalToWords as enOrdinal, ordinalSuffix as enOrdinalSuffix,
  yearToWords as enYear, decadeToWords as enDecade, fractionToWords as enFraction,
  decimalToWords as enDecimal, currencyToWords as enCurrency,
  percentageToWords as enPercentage, roomBusToWords as enRoomBus,
  scoreToWords as enScore, temperatureToWords as enTemperature,
  largeNumberToWords as enLarge
} from './numbers-en.js';

import {
  cardinalToWords as deCardinal, ordinalToWords as deOrdinal, ordinalSuffix as deOrdinalSuffix,
  yearToWords as deYear, decadeToWords as deDecade, fractionToWords as deFraction,
  decimalToWords as deDecimal, currencyToWords as deCurrency,
  percentageToWords as dePercentage, roomBusToWords as deRoomBus,
  scoreToWords as deScore, temperatureToWords as deTemperature,
  largeNumberToWords as deLarge
} from './numbers-de.js';

import {
  cardinalToWords as ukCardinal, ordinalToWords as ukOrdinal, ordinalSuffix as ukOrdinalSuffix,
  yearToWords as ukYear, decadeToWords as ukDecade, fractionToWords as ukFraction,
  decimalToWords as ukDecimal, currencyToWords as ukCurrency,
  percentageToWords as ukPercentage, roomBusToWords as ukRoomBus,
  scoreToWords as ukScore, temperatureToWords as ukTemperature,
  largeNumberToWords as ukLarge
} from './numbers-uk.js';

import { getLearnLang } from './i18n.js';

// ── Language-dispatched helpers ────────────────────────────────────────────

/** @returns {'en'|'de'|'uk'} */
function lang() { return getLearnLang(); }

function dispatch(enFn, deFn, ukFn, ...args) {
  const l = lang();
  if (l === 'uk') return ukFn(...args);
  if (l === 'de') return deFn(...args);
  return enFn(...args);
}

function cardinalToWords(n) { return dispatch(enCardinal, deCardinal, ukCardinal, n); }
function ordinalToWords(n) { return dispatch(enOrdinal, deOrdinal, ukOrdinal, n); }
function ordinalSuffix(n) { return dispatch(enOrdinalSuffix, deOrdinalSuffix, ukOrdinalSuffix, n); }
function yearToWords(y) { return dispatch(enYear, deYear, ukYear, y); }
function decadeToWords(d, q) { return dispatch(enDecade, deDecade, ukDecade, d, q); }
function fractionToWords(w, n, d) { return dispatch(enFraction, deFraction, ukFraction, w, n, d); }
function decimalToWords(n) { return dispatch(enDecimal, deDecimal, ukDecimal, n); }
function currencyToWords(a) { return dispatch(enCurrency, deCurrency, ukCurrency, a); }
function percentageToWords(n) { return dispatch(enPercentage, dePercentage, ukPercentage, n); }
function roomBusToWords(t, n) { return dispatch(enRoomBus, deRoomBus, ukRoomBus, t, n); }
function scoreToWords(h, a) { return dispatch(enScore, deScore, ukScore, h, a); }
function temperatureToWords(t) { return dispatch(enTemperature, deTemperature, ukTemperature, t); }
function largeNumberToWords(n) { return dispatch(enLarge, deLarge, ukLarge, n); }

// ── Display helpers for language-specific formatting ───────────────────────

/**
 * Format decimal display based on learning language.
 * @param {number} v
 * @returns {string}
 */
function formatDecimalDisplay(v) {
  const s = v.toFixed(2);
  return (lang() === 'de' || lang() === 'uk') ? s.replace('.', ',') : s;
}

/**
 * Format currency display based on learning language.
 * @param {number} v
 * @returns {string}
 */
function formatCurrencyDisplay(v) {
  const l = lang();
  if (l === 'uk') return '₴' + v.toFixed(2).replace('.', ',');
  if (l === 'de') return '€' + v.toFixed(2).replace('.', ',');
  return '$' + v.toFixed(2);
}

/**
 * Format percentage display based on learning language.
 * @param {number} v
 * @param {boolean} isWhole
 * @returns {string}
 */
function formatPercentageDisplay(v, isWhole) {
  if (isWhole) return v + '%';
  const formatted = v.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  return (lang() === 'de' || lang() === 'uk') ? formatted.replace('.', ',') + '%' : formatted + '%';
}

/**
 * Format large number display based on learning language.
 * @param {number} v
 * @returns {string}
 */
function formatLargeDisplay(v) {
  const l = lang();
  if (l === 'uk') return v.toLocaleString('uk-UA').replace(/,/g, '\u2009');
  if (l === 'de') return v.toLocaleString('de-DE');
  return v.toLocaleString('en-US').replace(/,/g, '\u2009');
}

/**
 * Room/bus display label.
 * @param {string} type
 * @returns {string}
 */
function roomLabel(type) {
  const l = lang();
  if (l === 'uk') return type === 'room' ? 'Кімната' : 'Автобус';
  if (l === 'de') return type === 'room' ? 'Raum' : 'Bus';
  return type === 'room' ? 'Room' : 'Bus';
}

/**
 * Decade display based on learning language.
 * @param {number} decade
 * @param {string} qualifier
 * @returns {string}
 */
function formatDecadeDisplay(decade, qualifier) {
  const l = lang();
  if (l === 'uk') {
    const qualMap = { early: 'початок', mid: 'середина', late: 'кінець' };
    const decNames = {
      50: "п'ятдесятих", 60: 'шістдесятих', 70: 'сімдесятих',
      80: 'вісімдесятих', 90: "дев'яностих"
    };
    return (qualMap[qualifier] || qualifier) + ' ' + (decNames[decade] || decade + '-х');
  }
  if (l === 'de') {
    const qualMap = { early: 'frühen', mid: 'mittleren', late: 'späten' };
    const decNames = { 50: 'Fünfziger', 60: 'Sechziger', 70: 'Siebziger', 80: 'Achtziger', 90: 'Neunziger' };
    return 'die ' + (qualMap[qualifier] || qualifier) + ' ' + (decNames[decade] || decade + 'er');
  }
  return 'the ' + qualifier + ' ' + decade + 's';
}

// ── Random helpers ─────────────────────────────────────────────────────────

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Display equality check ─────────────────────────────────────────────────

function isUnique(candidate, existing) {
  return !existing.some(e => e.display === candidate.display);
}

// ── Cardinal confusers ─────────────────────────────────────────────────────

function cardinalConfusers(target) {
  const n = target.value;
  const candidates = [];

  const build = (v) => ({
    value: v,
    display: String(v),
    ttsText: cardinalToWords(v),
    lastDigit: v % 10,
    category: 'cardinals',
  });

  const lastTwo = n % 100;
  if (lastTwo >= 13 && lastTwo <= 19) candidates.push(build((lastTwo % 10) * 10));
  if (lastTwo >= 20 && lastTwo <= 90 && lastTwo % 10 === 0) candidates.push(build((lastTwo / 10) + 10));

  const digits = String(n).split('');
  for (let i = 0; i < digits.length; i++) {
    if (digits[i] === '8') { const c = [...digits]; c[i] = '9'; candidates.push(build(Number(c.join('')))); }
    if (digits[i] === '9') { const c = [...digits]; c[i] = '8'; candidates.push(build(Number(c.join('')))); }
  }

  for (const d of [-1, 1, -2, 2, -10, 10]) {
    const v = n + d;
    if (v >= 1 && v <= 200) candidates.push(build(v));
  }

  // FIX MAJOR-4: German digit-swap confusers for 21-99
  // German inverts units/tens (einundzwanzig = 21), so 24 and 42
  // sound very similar (vierundzwanzig vs zweiundvierzig).
  if (lang() === 'de') {
    const lastTwo = n % 100;
    if (lastTwo >= 21 && lastTwo <= 99) {
      const t = Math.floor(lastTwo / 10);
      const u = lastTwo % 10;
      if (u !== 0 && t !== u) {
        const swapped = (n - lastTwo) + u * 10 + t;
        if (swapped >= 1 && swapped <= 200) candidates.push(build(swapped));
      }
    }
  }

  return candidates.filter(c => c.value !== n && c.value > 0);
}

// ── Ordinal confusers ──────────────────────────────────────────────────────

function ordinalConfusers(target) {
  const n = target.value;
  const candidates = [];

  const build = (v) => ({
    value: v,
    display: v + ordinalSuffix(v),
    ttsText: ordinalToWords(v),
    lastDigit: v % 10,
    category: 'ordinals',
  });

  if (n >= 13 && n <= 19) candidates.push(build((n % 10) * 10));
  if (n >= 20 && n <= 90 && n % 10 === 0) candidates.push(build((n / 10) + 10));

  for (const d of [-1, 1, -2, 2, -10, 10]) {
    const v = n + d;
    if (v >= 1 && v <= 100) candidates.push(build(v));
  }

  if (n === 5) candidates.push(build(6));
  if (n === 6) candidates.push(build(5));
  if (n === 8) candidates.push(build(18));
  if (n === 18) candidates.push(build(8));

  return candidates.filter(c => c.value !== n && c.value >= 1);
}

// ── Year confusers ─────────────────────────────────────────────────────────

function yearConfusers(target) {
  const candidates = [];

  if (target.value && target.value.isDecade) {
    const { decade, qualifier } = target.value;
    const qualifiers = ['early', 'mid', 'late'];
    const decades = [50, 60, 70, 80, 90];

    for (const q of qualifiers) {
      if (q !== qualifier) {
        candidates.push({
          value: { decade, qualifier: q, isDecade: true },
          display: formatDecadeDisplay(decade, q),
          ttsText: decadeToWords(decade, q),
          lastDigit: Math.floor(decade / 10),
          category: 'years',
        });
      }
    }

    for (const d of decades) {
      if (d !== decade) {
        candidates.push({
          value: { decade: d, qualifier, isDecade: true },
          display: formatDecadeDisplay(d, qualifier),
          ttsText: decadeToWords(d, qualifier),
          lastDigit: Math.floor(d / 10),
          category: 'years',
        });
      }
    }

    return candidates;
  }

  const year = target.value;
  const build = (y) => ({
    value: y,
    display: String(y),
    ttsText: yearToWords(y),
    lastDigit: y % 10,
    category: 'years',
  });

  for (const d of [1, -1, 10, -10, 100, -100]) {
    const y = year + d;
    if (y >= 1100 && y <= 2100) candidates.push(build(y));
  }

  const lo = year % 100;
  const base = year - lo;
  if (lo >= 13 && lo <= 19) {
    const swapped = base + (lo % 10) * 10;
    if (swapped >= 1100 && swapped <= 2100) candidates.push(build(swapped));
  }
  if (lo >= 20 && lo <= 90 && lo % 10 === 0) {
    const swapped = base + (lo / 10) + 10;
    if (swapped >= 1100 && swapped <= 2100) candidates.push(build(swapped));
  }

  return candidates.filter(c => c.display !== target.display);
}

// ── Fraction confusers ─────────────────────────────────────────────────────

function fractionConfusers(target) {
  const { whole, num, den } = target.value;
  const candidates = [];

  const build = (w, n, d) => {
    const displayFrac = n + '/' + d;
    const display = w > 0 ? w + ' ' + displayFrac : displayFrac;
    return {
      value: { whole: w, num: n, den: d },
      display,
      ttsText: fractionToWords(w, n, d),
      lastDigit: d % 10,
      category: 'fractions',
    };
  };

  for (let nn = 1; nn < den; nn++) {
    if (nn !== num) candidates.push(build(whole, nn, den));
  }

  for (const dd of [2, 3, 4, 5, 6, 8, 10]) {
    if (dd !== den && num < dd) candidates.push(build(whole, num, dd));
  }

  if (whole > 0) {
    candidates.push(build(0, num, den));
    candidates.push(build(whole + 1, num, den));
    candidates.push(build(whole - 1 > 0 ? whole - 1 : 0, num, den));
  } else {
    candidates.push(build(1, num, den));
  }

  if (den === 2) candidates.push(build(whole, 1, 4));
  if (den === 4 && num === 1) candidates.push(build(whole, 1, 2));

  return candidates.filter(c => c.display !== target.display && c.value.num >= 1 && c.value.num < c.value.den);
}

// ── Decimal confusers ──────────────────────────────────────────────────────

function decimalConfusers(target) {
  const n = target.value;
  const candidates = [];

  const build = (v) => {
    const display = formatDecimalDisplay(v);
    const fracStr = v.toFixed(2).split('.')[1];
    return {
      value: v,
      display,
      ttsText: decimalToWords(v),
      lastDigit: parseInt(fracStr[fracStr.length - 1], 10),
      category: 'decimals',
    };
  };

  const str = n.toFixed(2);
  const parts = str.split('.');
  const intPart = parseInt(parts[0], 10);
  const d1 = parts[1][0];
  const d2 = parts[1][1];
  if (d1 !== d2) {
    candidates.push(build(parseFloat(intPart + '.' + d2 + d1)));
  }

  for (const delta of [1, -1]) {
    const v = n + delta;
    if (v >= 0.01 && v <= 99.99) candidates.push(build(Math.round(v * 100) / 100));
  }

  if (d1 === '0' && d2 !== '0') candidates.push(build(parseFloat(intPart + '.' + d2 + '0')));
  if (d2 === '0' && d1 !== '0') candidates.push(build(parseFloat(intPart + '.0' + d1)));

  const shifted = n * 10;
  if (shifted <= 99.99) candidates.push(build(Math.round(shifted * 100) / 100));
  const shiftedDown = n / 10;
  if (shiftedDown >= 0.01) candidates.push(build(Math.round(shiftedDown * 100) / 100));

  return candidates.filter(c => c.display !== target.display && c.value > 0);
}

// ── Currency confusers ─────────────────────────────────────────────────────

function currencyConfusers(target) {
  const amount = target.value;
  const totalCents = Math.round(amount * 100);
  const dollars = Math.floor(totalCents / 100);
  const cents = totalCents % 100;
  const candidates = [];

  const build = (v) => {
    const tc = Math.round(v * 100);
    return {
      value: v,
      display: formatCurrencyDisplay(v),
      ttsText: currencyToWords(v),
      lastDigit: tc % 10,
      category: 'currencies',
    };
  };

  if (cents > 0 && cents <= 999) {
    const swapped = cents + dollars / 100;
    if (swapped >= 0.01 && swapped <= 999.99) candidates.push(build(Math.round(swapped * 100) / 100));
  }

  for (const d of [1, -1, 0.10, -0.10]) {
    const v = amount + d;
    if (v >= 0.01 && v <= 999.99) candidates.push(build(Math.round(v * 100) / 100));
  }

  const mag = amount * 10;
  if (mag <= 999.99) candidates.push(build(Math.round(mag * 100) / 100));
  const magDown = amount / 10;
  if (magDown >= 0.01) candidates.push(build(Math.round(magDown * 100) / 100));

  if (cents === 0 && dollars > 0) {
    candidates.push(build(dollars * 10));
    if (dollars >= 10) candidates.push(build(dollars / 10));
  }

  return candidates.filter(c => c.display !== target.display && c.value > 0);
}

// ── Percentage confusers ───────────────────────────────────────────────────

function percentageConfusers(target) {
  const n = target.value;
  const candidates = [];

  const build = (v) => {
    const isWhole = Number.isInteger(v);
    const display = formatPercentageDisplay(v, isWhole);
    let lastDig;
    if (isWhole) {
      lastDig = v % 10;
    } else {
      const str = v.toFixed(2).replace(/0+$/, '');
      lastDig = parseInt(str[str.length - 1], 10);
    }
    return {
      value: v,
      display,
      ttsText: percentageToWords(v),
      lastDigit: lastDig,
      category: 'percentages',
    };
  };

  if (!Number.isInteger(n)) {
    const str = n.toFixed(2);
    const parts = str.split('.');
    const d1 = parts[1][0];
    const d2 = parts[1][1];
    if (d1 !== d2) {
      candidates.push(build(parseFloat(parts[0] + '.' + d2 + d1)));
    }
  }

  if (Number.isInteger(n)) {
    if (n <= 99) candidates.push(build(n / 10));
    if (n <= 10) candidates.push(build(n * 10));
  } else {
    candidates.push(build(Math.round(n)));
    candidates.push(build(n * 10 <= 100 ? n * 10 : n / 10));
  }

  for (const d of [1, -1, 5, -5]) {
    const v = n + d;
    if (v > 0 && v <= 100) candidates.push(build(Math.round(v * 100) / 100));
  }

  return candidates.filter(c => c.display !== target.display && c.value > 0);
}

// ── Room/Bus confusers ─────────────────────────────────────────────────────

function roomBusConfusers(target) {
  const { type, number } = target.value;
  const candidates = [];
  const label = roomLabel(type);

  const build = (num) => ({
    value: { type, number: num },
    display: label + ' ' + num,
    ttsText: roomBusToWords(type, num),
    lastDigit: num % 10,
    category: 'roomBus',
  });

  const h = Math.floor(number / 100);
  const remainder = number % 100;
  const t = Math.floor(remainder / 10);
  const u = remainder % 10;

  if (t === 0 && u > 0) candidates.push(build(h * 100 + u * 10));
  if (u === 0 && t > 0) candidates.push(build(h * 100 + t));

  for (const d of [1, -1]) {
    const v = number + d;
    if (v >= 100 && v <= 999) candidates.push(build(v));
  }

  if (h !== u) candidates.push(build(u * 100 + t * 10 + h));
  if (t !== u) candidates.push(build(h * 100 + u * 10 + t));

  for (const d of [100, -100]) {
    const v = number + d;
    if (v >= 100 && v <= 999) candidates.push(build(v));
  }

  return candidates.filter(c => c.display !== target.display && c.value.number >= 100);
}

// ── Sports confusers ───────────────────────────────────────────────────────

function sportsConfusers(target) {
  const { home, away } = target.value;
  const candidates = [];

  const build = (h, a) => ({
    value: { home: h, away: a },
    display: h + ':' + a,
    ttsText: scoreToWords(h, a),
    lastDigit: a,
    category: 'sports',
  });

  if (home !== away) candidates.push(build(away, home));

  for (const d of [1, -1]) {
    const h = home + d;
    const a = away + d;
    if (h >= 0 && h <= 7) candidates.push(build(h, away));
    if (a >= 0 && a <= 5) candidates.push(build(home, a));
  }

  candidates.push(build(home + 1, away > 0 ? away - 1 : away));
  candidates.push(build(home > 0 ? home - 1 : home, away + 1));

  const commonScores = [[1,0],[0,1],[1,1],[2,0],[0,2],[2,1],[1,2],[3,0],[0,3],[2,2],[3,1]];
  for (const [h, a] of commonScores) {
    candidates.push(build(h, a));
  }

  return candidates.filter(c =>
    c.display !== target.display &&
    c.value.home >= 0 && c.value.home <= 7 &&
    c.value.away >= 0 && c.value.away <= 5
  );
}

// ── Temperature confusers ──────────────────────────────────────────────────

function temperatureConfusers(target) {
  const temp = target.value;
  const candidates = [];

  const build = (t) => ({
    value: t,
    display: t + '°C',
    ttsText: temperatureToWords(t),
    lastDigit: Math.abs(t) % 10,
    category: 'temperatures',
  });

  candidates.push(build(-temp));

  for (const d of [1, -1, 5, -5, 10, -10]) {
    const v = temp + d;
    if (v >= -30 && v <= 45) candidates.push(build(v));
  }

  const absTemp = Math.abs(temp);
  const sign = temp < 0 ? -1 : 1;
  if (absTemp >= 13 && absTemp <= 19) {
    const swapped = (absTemp % 10) * 10 * sign;
    if (swapped >= -30 && swapped <= 45) candidates.push(build(swapped));
  }
  if (absTemp >= 20 && absTemp <= 50 && absTemp % 10 === 0) {
    const swapped = ((absTemp / 10) + 10) * sign;
    if (swapped >= -30 && swapped <= 45) candidates.push(build(swapped));
  }

  return candidates.filter(c => c.display !== target.display && c.value >= -30 && c.value <= 45);
}

// ── Large number confusers ─────────────────────────────────────────────────

function largeConfusers(target) {
  const n = target.value;
  const candidates = [];

  const build = (v) => ({
    value: v,
    display: formatLargeDisplay(v),
    ttsText: largeNumberToWords(v),
    lastDigit: v % 10,
    category: 'large',
  });

  candidates.push(build(n * 10));
  if (n >= 10) candidates.push(build(Math.floor(n / 10)));

  for (const d of [100, -100, 1000, -1000, 10000, -10000]) {
    const v = n + d;
    if (v >= 100 && v <= 9999999) candidates.push(build(v));
  }

  const lo = n % 100;
  const base = n - lo;
  if (lo >= 13 && lo <= 19) candidates.push(build(base + (lo % 10) * 10));
  if (lo >= 20 && lo <= 90 && lo % 10 === 0) candidates.push(build(base + (lo / 10) + 10));

  return candidates.filter(c => c.display !== target.display && c.value >= 100 && c.value <= 9999999);
}

// ── Confuser strategy router ───────────────────────────────────────────────

const CONFUSER_FN = {
  cardinals: cardinalConfusers,
  ordinals: ordinalConfusers,
  years: yearConfusers,
  fractions: fractionConfusers,
  decimals: decimalConfusers,
  currencies: currencyConfusers,
  percentages: percentageConfusers,
  roomBus: roomBusConfusers,
  sports: sportsConfusers,
  temperatures: temperatureConfusers,
  large: largeConfusers,
};

// ── Last-digit constraint enforcement ──────────────────────────────────────

function enforceLastDigitConstraint(target, confusers, confuserFn) {
  const all = [target, ...confusers];
  const targetLD = target.lastDigit;
  const sameLD = all.filter(o => o.lastDigit === targetLD).length;

  if (sameLD >= 2) return confusers;

  const allCandidates = confuserFn(target);
  const matchingLD = allCandidates.filter(c =>
    c.lastDigit === targetLD && isUnique(c, all)
  );

  if (matchingLD.length > 0) {
    confusers[confusers.length - 1] = matchingLD[0];
  }

  return confusers;
}

// ── Main public API ────────────────────────────────────────────────────────

/**
 * Generate exactly 3 confusers for a given target CategoryValue.
 * @param {object} target
 * @returns {object[]}
 */
export function generateConfusers(target) {
  const cat = target.mixedCategory || target.category;
  const confuserFn = CONFUSER_FN[cat] || cardinalConfusers;
  const allCandidates = confuserFn(target);

  const seen = new Set([target.display]);
  const unique = [];
  for (const c of allCandidates) {
    if (!seen.has(c.display)) {
      seen.add(c.display);
      unique.push(c);
    }
  }

  const result = unique.slice(0, 3);

  while (result.length < 3) {
    const fallback = generateFallback(target, [...result, target]);
    if (fallback && !seen.has(fallback.display)) {
      seen.add(fallback.display);
      result.push(fallback);
    } else {
      const emergency = createEmergencyFallback(target, seen);
      if (emergency) {
        seen.add(emergency.display);
        result.push(emergency);
      } else {
        break;
      }
    }
  }

  if (result.length === 3) {
    return enforceLastDigitConstraint(target, result, confuserFn);
  }

  return result;
}

/**
 * Generate a generic fallback confuser.
 * @param {object} target
 * @param {object[]} existing
 * @returns {object|null}
 */
function generateFallback(target, existing) {
  const cat = target.mixedCategory || target.category;

  if (typeof target.value === 'number') {
    for (const d of [1, -1, 2, -2, 5, -5, 10, -10]) {
      const v = target.value + d;
      if (cat !== 'temperatures' && v <= 0) continue;
      let candidate;

      switch (cat) {
        case 'cardinals':
          candidate = { value: v, display: String(v), ttsText: cardinalToWords(v), lastDigit: v % 10, category: cat };
          break;
        case 'temperatures':
          if (v < -30 || v > 45) continue;
          candidate = { value: v, display: v + '°C', ttsText: temperatureToWords(v), lastDigit: Math.abs(v) % 10, category: cat };
          break;
        case 'large':
          candidate = { value: v, display: formatLargeDisplay(v), ttsText: largeNumberToWords(v), lastDigit: v % 10, category: cat };
          break;
        case 'decimals': {
          if (v <= 0 || v > 99.99) continue;
          const display = formatDecimalDisplay(v);
          const fracStr = v.toFixed(2).split('.')[1];
          candidate = { value: v, display, ttsText: decimalToWords(v), lastDigit: parseInt(fracStr[fracStr.length - 1], 10), category: cat };
          break;
        }
        default:
          continue;
      }

      if (candidate && isUnique(candidate, existing)) return candidate;
    }
  }

  return null;
}

/**
 * Create an emergency fallback (last resort).
 * @param {object} target
 * @param {Set<string>} seenDisplays
 * @returns {object|null}
 */
function createEmergencyFallback(target, seenDisplays) {
  const cat = target.mixedCategory || target.category;

  for (let attempts = 0; attempts < 20; attempts++) {
    let candidate = null;

    switch (cat) {
      case 'sports': {
        const h = randInt(0, 7);
        const a = randInt(0, 5);
        const display = h + ':' + a;
        if (!seenDisplays.has(display)) {
          candidate = { value: { home: h, away: a }, display, ttsText: scoreToWords(h, a), lastDigit: a, category: 'sports' };
        }
        break;
      }
      case 'temperatures': {
        const t = randInt(-30, 45);
        const display = t + '°C';
        if (!seenDisplays.has(display)) {
          candidate = { value: t, display, ttsText: temperatureToWords(t), lastDigit: Math.abs(t) % 10, category: 'temperatures' };
        }
        break;
      }
      case 'fractions': {
        const dens = [2, 3, 4, 5, 6, 8, 10];
        const d = pick(dens);
        const n = randInt(1, d - 1);
        const displayFrac = n + '/' + d;
        if (!seenDisplays.has(displayFrac)) {
          candidate = { value: { whole: 0, num: n, den: d }, display: displayFrac, ttsText: fractionToWords(0, n, d), lastDigit: d % 10, category: 'fractions' };
        }
        break;
      }
      case 'currencies': {
        const v = randInt(1, 99900) / 100;
        const display = formatCurrencyDisplay(v);
        if (!seenDisplays.has(display)) {
          const tc = Math.round(v * 100);
          candidate = { value: v, display, ttsText: currencyToWords(v), lastDigit: tc % 10, category: 'currencies' };
        }
        break;
      }
      case 'percentages': {
        const v = randInt(1, 100);
        const display = v + '%';
        if (!seenDisplays.has(display)) {
          candidate = { value: v, display, ttsText: percentageToWords(v), lastDigit: v % 10, category: 'percentages' };
        }
        break;
      }
      case 'roomBus': {
        const type = target.value && target.value.type ? target.value.type : 'room';
        const num = randInt(100, 999);
        const label = roomLabel(type);
        const display = label + ' ' + num;
        if (!seenDisplays.has(display)) {
          candidate = { value: { type, number: num }, display, ttsText: roomBusToWords(type, num), lastDigit: num % 10, category: 'roomBus' };
        }
        break;
      }
      case 'ordinals': {
        const v = randInt(1, 100);
        const display = v + ordinalSuffix(v);
        if (!seenDisplays.has(display)) {
          candidate = { value: v, display, ttsText: ordinalToWords(v), lastDigit: v % 10, category: 'ordinals' };
        }
        break;
      }
      case 'years': {
        const y = randInt(1200, 2026);
        const display = String(y);
        if (!seenDisplays.has(display)) {
          candidate = { value: y, display, ttsText: yearToWords(y), lastDigit: y % 10, category: 'years' };
        }
        break;
      }
      case 'decimals': {
        const v = randInt(1, 9999) / 100;
        const display = formatDecimalDisplay(v);
        if (!seenDisplays.has(display)) {
          const fracStr = v.toFixed(2).split('.')[1];
          candidate = { value: v, display, ttsText: decimalToWords(v), lastDigit: parseInt(fracStr[fracStr.length - 1], 10), category: 'decimals' };
        }
        break;
      }
      default: {
        const v = randInt(1, 100);
        const display = String(v);
        if (!seenDisplays.has(display)) {
          candidate = { value: v, display, ttsText: cardinalToWords(v), lastDigit: v % 10, category: cat };
        }
        break;
      }
    }

    if (candidate && !seenDisplays.has(candidate.display) && candidate.display !== target.display) {
      return candidate;
    }
  }
  return null;
}
