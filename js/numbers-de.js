// numbers-de.js — German number-to-words functions
// All functions produce TTS-ready text strings for the Web Speech API
// CRITICAL: German number rules — units before tens for 21-99 (einundzwanzig)
// FIX v2b: "eins" (standalone) vs "ein" (before nouns/in compounds)

// ── Lookup tables ──────────────────────────────────────────────────────────

/** @type {string[]} Cardinal ones 0-19 (standalone forms) */
const ONES = [
  'null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben',
  'acht', 'neun', 'zehn', 'elf', 'zwölf', 'dreizehn',
  'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'
];

/** @type {string[]} Compound ones 0-9 (used inside compounds: "ein" not "eins") */
const ONES_COMPOUND = [
  '', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben',
  'acht', 'neun'
];

/** @type {string[]} Tens 20-90 */
const TENS = [
  '', '', 'zwanzig', 'dreißig', 'vierzig', 'fünfzig',
  'sechzig', 'siebzig', 'achtzig', 'neunzig'
];

/** @type {Object<number, string>} Irregular ordinals */
const ORDINAL_IRREGULAR = {
  1: 'erste',
  3: 'dritte',
  7: 'siebte',
  8: 'achte',
};

/** @type {Object<number, string>} Decade words for "die Neunziger" etc. */
const DECADE_WORDS = {
  5: 'Fünfziger',
  6: 'Sechziger',
  7: 'Siebziger',
  8: 'Achtziger',
  9: 'Neunziger',
};

/** @type {Object<string, string>} Decade qualifier translations */
const DECADE_QUALIFIERS = {
  early: 'frühen',
  mid: 'mittleren',
  late: 'späten',
};

/** @type {Object<number, string>} Special fraction denominator names (singular) */
const DENOMINATOR_NAMES = {
  2: 'halb',
  3: 'Drittel',
  4: 'Viertel',
  5: 'Fünftel',
  6: 'Sechstel',
  7: 'Siebtel',
  8: 'Achtel',
  9: 'Neuntel',
  10: 'Zehntel',
};

// ── Internal helpers ───────────────────────────────────────────────────────

/**
 * Convert a two-digit number (0-99) to German words.
 * Handles the critical German inversion: units come BEFORE tens for 21-99.
 * E.g. 21 → "einundzwanzig" (one-and-twenty), NOT "zwanzigeins"
 * @param {number} n - Number 0-99
 * @param {boolean} [standalone=false] - If true, use "eins" for 1 (not "ein")
 * @returns {string}
 */
function twoDigitToWords(n, standalone = false) {
  if (n === 0) return '';
  if (n === 1) return standalone ? 'eins' : 'ein';
  if (n < 20) return ONES[n];

  const t = Math.floor(n / 10);
  const o = n % 10;

  if (o === 0) return TENS[t];

  // German inversion: unit + "und" + tens
  return ONES_COMPOUND[o] + 'und' + TENS[t];
}

// ── Cardinals ──────────────────────────────────────────────────────────────

/**
 * Convert a cardinal number to German words.
 * Supports 0 to 999,999,999.
 *
 * standalone parameter controls "eins" vs "ein" for the number 1:
 *   - standalone=true  → "eins" (when the number stands alone: "Wie viel? Eins.")
 *   - standalone=false → "ein"  (before nouns: "ein Euro", "ein Drittel")
 *
 * For compound numbers ending in 1 (101, 1001), standalone controls the
 * trailing "eins"/"ein": "einhunderteins" (standalone) vs "einhundertein" (before noun).
 *
 * @param {number} n
 * @param {boolean} [standalone=true] - Use "eins" for trailing 1 when true
 * @returns {string}
 */
export function cardinalToWords(n, standalone = true) {
  if (n === 0) return 'null';
  if (n < 0) return 'minus ' + cardinalToWords(-n, standalone);

  let result = '';

  if (n >= 1000000) {
    const millions = Math.floor(n / 1000000);
    if (millions === 1) {
      result += 'eine Million ';
    } else {
      result += cardinalToWords(millions, false) + ' Millionen ';
    }
    n = n % 1000000;
    if (n === 0) return result.trim();
  }

  // FIX CRITICAL-1: Use recursive cardinalToWords for thousands ≥ 100
  // Previously used twoDigitToWords() which only handles 0-99
  if (n >= 1000) {
    const thousands = Math.floor(n / 1000);
    if (thousands === 1) {
      result += 'eintausend';
    } else {
      // Recursive call handles 2-999 correctly (including hundreds)
      result += cardinalToWords(thousands, false) + 'tausend';
    }
    n = n % 1000;
    if (n === 0) return result.trim();
  }

  if (n >= 100) {
    const hundreds = Math.floor(n / 100);
    if (hundreds === 1) {
      result += 'einhundert';
    } else {
      result += ONES_COMPOUND[hundreds] + 'hundert';
    }
    n = n % 100;
    if (n === 0) return result.trim();
  }

  // FIX CRITICAL-2/3/4: Correct "eins" vs "ein" for trailing digits
  // The standalone parameter flows through to the final 1-99 portion.
  // For n=1: standalone → "eins", !standalone → "ein"
  // For n=2-19: always same form (no eins/ein distinction)
  // For n=21-99: compound form always uses "ein" in "einund..." (correct)
  if (n > 0) {
    if (n === 1) {
      result += standalone ? 'eins' : 'ein';
    } else {
      result += twoDigitToWords(n, false);
    }
  }

  return result.trim();
}

// ── Ordinals ───────────────────────────────────────────────────────────────

/**
 * Convert a number to its German ordinal word form WITH article.
 * Rules: 1-19 add "-te", 20+ add "-ste", with irregulars.
 * FIX MAJOR-1: Added "der" prefix (matches English "the first" pattern).
 * E.g. 1→"der erste", 2→"der zweite", 3→"der dritte", 20→"der zwanzigste"
 * @param {number} n - Number 1-100+
 * @returns {string}
 */
export function ordinalToWords(n) {
  if (n <= 0) return 'der nullte';

  // Check irregulars first (only apply to the last portion)
  if (n < 20) {
    if (ORDINAL_IRREGULAR[n]) return 'der ' + ORDINAL_IRREGULAR[n];
    return 'der ' + ONES[n] + 'te';
  }

  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    if (o === 0) return 'der ' + TENS[t] + 'ste';
    // Compound ordinal: der einundzwanzigste
    const unitPart = ONES_COMPOUND[o];
    return 'der ' + unitPart + 'und' + TENS[t] + 'ste';
  }

  if (n === 100) return 'der hundertste';

  // For 101+, build cardinal base + "ste"
  return 'der ' + cardinalToWords(n, false) + 'ste';
}

/**
 * German ordinal display suffix (just a period).
 * In German, ordinals are written as "1.", "2.", "3." etc.
 * @param {number} _n - Number (unused, German always uses period)
 * @returns {string}
 */
export function ordinalSuffix(_n) {
  return '.';
}

// ── Years ──────────────────────────────────────────────────────────────────

/**
 * Convert a year (1000-2099) to spoken German words.
 * FIX MAJOR-2: Years are standalone — trailing 1 should be "eins" not "ein".
 * Rules:
 *   - 2000 → "zweitausend"
 *   - 2001-2009 → "zweitausendeins", etc.
 *   - 2010-2099 → "zweitausendzehn", etc.
 *   - 1100-1999 → split as hundreds: 1987→"neunzehnhundertsiebenundachtzig"
 *   - Exact hundreds like 1200 → "zwölfhundert"
 *   - 1000-1099 → "tausend..." e.g. 1066→"tausendsechsundsechzig"
 * @param {number} year
 * @returns {string}
 */
export function yearToWords(year) {
  if (year === 2000) return 'zweitausend';

  if (year >= 2001 && year <= 2009) {
    return 'zweitausend' + ONES[year - 2000];
  }

  if (year >= 2010 && year <= 2099) {
    return 'zweitausend' + twoDigitToWords(year - 2000, false);
  }

  // 1000-1099
  if (year >= 1000 && year <= 1099) {
    const lo = year % 100;
    if (lo === 0) return 'tausend';
    // FIX: standalone=true — years are standalone, trailing 1 → "eins"
    return 'tausend' + twoDigitToWords(lo, true);
  }

  // 1100-1999: split into high/low hundreds
  if (year >= 1100 && year <= 1999) {
    const hi = Math.floor(year / 100);
    const lo = year % 100;
    const hiWords = twoDigitToWords(hi, false) + 'hundert';
    if (lo === 0) return hiWords;
    // FIX: standalone=true — years are standalone, trailing 1 → "eins"
    return hiWords + twoDigitToWords(lo, true);
  }

  // Fallback for other years
  return cardinalToWords(year, true);
}

// ── Decades ────────────────────────────────────────────────────────────────

/**
 * Convert a decade + qualifier to spoken German words.
 * E.g. (90, 'early') → "die frühen Neunziger"
 * @param {number} decade - 50, 60, 70, 80, 90
 * @param {string} qualifier - 'early', 'mid', 'late'
 * @returns {string}
 */
export function decadeToWords(decade, qualifier) {
  const decadeIndex = decade / 10;
  const decadeWord = DECADE_WORDS[decadeIndex] || (twoDigitToWords(decade, false) + 'er');
  const qualifierWord = DECADE_QUALIFIERS[qualifier] || qualifier;
  return 'die ' + qualifierWord + ' ' + decadeWord;
}

// ── Fractions ──────────────────────────────────────────────────────────────

/**
 * Get the German denominator name for fractions.
 * Rules: 2-19 use "-tel" suffix, 20+ use "-stel" suffix.
 * @param {number} den - Denominator
 * @returns {string}
 */
function getDenominatorName(den) {
  if (DENOMINATOR_NAMES[den]) return DENOMINATOR_NAMES[den];
  if (den < 20) {
    // Use cardinal form + "tel"
    return cardinalToWords(den, false) + 'tel';
  }
  // 20+: use cardinal form + "stel"
  return twoDigitToWords(den, false) + 'stel';
}

/**
 * Convert a fraction to spoken German words.
 * FIX CRITICAL-2: Use standalone=false for numerator (precedes denominator noun).
 * E.g. (0, 1, 3) → "ein Drittel", (2, 3, 4) → "zwei und drei Viertel"
 * @param {number} whole - Whole number part (0 if none)
 * @param {number} num - Numerator
 * @param {number} den - Denominator
 * @returns {string}
 */
export function fractionToWords(whole, num, den) {
  let fracPart;

  if (den === 2 && num === 1) {
    fracPart = 'ein halb';
  } else {
    // FIX: standalone=false → "ein Drittel" not "eins Drittel"
    const numWord = cardinalToWords(num, false);
    const denName = getDenominatorName(den);
    fracPart = numWord + ' ' + denName;
  }

  if (whole > 0) {
    const wholeWord = cardinalToWords(whole, true);
    return wholeWord + ' und ' + fracPart;
  }

  return fracPart;
}

// ── Decimals ───────────────────────────────────────────────────────────────

/**
 * Convert a decimal number to spoken German words (digit-by-digit after comma).
 * German uses "Komma" instead of "point".
 * E.g. 1.36 → "eins Komma drei sechs", 0.02 → "null Komma null zwei"
 * @param {number} n
 * @returns {string}
 */
export function decimalToWords(n) {
  const str = n.toFixed(2);
  const parts = str.split('.');
  const intPart = parseInt(parts[0], 10);
  const fracStr = parts[1];

  const intWord = cardinalToWords(intPart, true);

  // Fractional part: digit-by-digit using German words
  const fracDigits = fracStr.split('').map(d => {
    return ONES[parseInt(d, 10)];
  });

  return intWord + ' Komma ' + fracDigits.join(' ');
}

// ── Currencies ─────────────────────────────────────────────────────────────

/**
 * Convert a Euro amount to spoken German words.
 * FIX CRITICAL-3: Use standalone=false (before "Euro"/"Cent" nouns).
 * FIX MAJOR-3: Add "und" between Euro and Cent.
 * E.g. 1.01 → "ein Euro und ein Cent", 5.35 → "fünf Euro und fünfunddreißig Cent"
 * @param {number} amount
 * @returns {string}
 */
export function currencyToWords(amount) {
  const totalCents = Math.round(amount * 100);
  const euros = Math.floor(totalCents / 100);
  const cents = totalCents % 100;

  if (euros === 0 && cents === 0) return 'null Euro';

  let result = '';

  if (euros > 0) {
    // FIX: standalone=false → "ein Euro" not "eins Euro"
    result += cardinalToWords(euros, false) + ' Euro';
  }

  if (cents > 0) {
    // FIX MAJOR-3: Add " und " between Euro and Cent
    if (euros > 0) result += ' und ';
    // FIX: standalone=false → "ein Cent" not "eins Cent"
    result += cardinalToWords(cents, false) + ' Cent';
  }

  return result;
}

// ── Percentages ────────────────────────────────────────────────────────────

/**
 * Convert a percentage value to spoken German words.
 * FIX CRITICAL-3: Use standalone=false before "Prozent" noun.
 * E.g. 1 → "ein Prozent", 7.98 → "sieben Komma neun acht Prozent"
 * @param {number} n
 * @returns {string}
 */
export function percentageToWords(n) {
  if (Number.isInteger(n) || Math.abs(n - Math.round(n)) < 0.001) {
    // FIX: standalone=false → "ein Prozent" not "eins Prozent"
    return cardinalToWords(Math.round(n), false) + ' Prozent';
  }

  // Has decimal part
  const str = n.toFixed(2).replace(/0+$/, '');
  const parts = str.split('.');
  const intPart = parseInt(parts[0], 10);
  const fracStr = parts[1] || '';

  // FIX: standalone=false for integer part before "Komma...Prozent"
  const intWord = cardinalToWords(intPart, false);

  const fracDigits = fracStr.split('').map(d => {
    return ONES[parseInt(d, 10)];
  });

  return intWord + ' Komma ' + fracDigits.join(' ') + ' Prozent';
}

// ── Room/Bus Numbers ───────────────────────────────────────────────────────

/**
 * Convert a room/bus number to spoken German words.
 * Room→"Raum", Bus stays "Bus".
 * E.g. ('room', 101) → "Raum einhunderteins", ('bus', 305) → "Bus dreihundertfünf"
 * @param {string} type - 'room' or 'bus'
 * @param {number} number
 * @returns {string}
 */
export function roomBusToWords(type, number) {
  const label = type === 'room' ? 'Raum' : 'Bus';
  return label + ' ' + cardinalToWords(number, true);
}

// ── Sports Scores ──────────────────────────────────────────────────────────

/**
 * Convert a sports score to spoken German words.
 * German uses "zu" between scores: 5:0 → "fünf zu null"
 * Scores are standalone — "drei zu eins" (eins correct after "zu").
 * @param {number} home
 * @param {number} away
 * @returns {string}
 */
export function scoreToWords(home, away) {
  const homeWord = cardinalToWords(home, true);
  const awayWord = cardinalToWords(away, true);
  return homeWord + ' zu ' + awayWord;
}

// ── Temperatures ───────────────────────────────────────────────────────────

/**
 * Convert a temperature to spoken German words.
 * E.g. -10 → "minus zehn Grad Celsius", 1 → "ein Grad Celsius"
 * @param {number} temp
 * @returns {string}
 */
export function temperatureToWords(temp) {
  let prefix = '';
  if (temp < 0) prefix = 'minus ';

  // "ein Grad" (not "eins Grad") — "Grad" is a noun → standalone=false
  const absTemp = Math.abs(temp);
  const numWord = cardinalToWords(absTemp, false);

  return prefix + numWord + ' Grad Celsius';
}

// ── Large Numbers ──────────────────────────────────────────────────────────

/**
 * Convert a large number to spoken German words.
 * Delegates to cardinalToWords.
 * @param {number} n
 * @returns {string}
 */
export function largeNumberToWords(n) {
  return cardinalToWords(n, true);
}
