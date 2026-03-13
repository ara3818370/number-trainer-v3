// numbers-en.js — English number-to-words functions
// All functions produce TTS-ready text strings for the Web Speech API

// ── Lookup tables ──────────────────────────────────────────────────────────

const ONES = [
  '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven',
  'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen',
  'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
];

const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty',
  'sixty', 'seventy', 'eighty', 'ninety'
];

const ORDINAL_ONES = [
  '', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh',
  'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth',
  'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'
];

const ORDINAL_TENS = [
  '', '', 'twentieth', 'thirtieth', 'fortieth', 'fiftieth',
  'sixtieth', 'seventieth', 'eightieth', 'ninetieth'
];

const TENS_WORDS = {
  5: 'fifties', 6: 'sixties', 7: 'seventies',
  8: 'eighties', 9: 'nineties'
};

const DENOMINATOR_SINGULAR = {
  2: 'half', 3: 'third', 4: 'quarter', 5: 'fifth',
  6: 'sixth', 7: 'seventh', 8: 'eighth', 9: 'ninth', 10: 'tenth'
};

const DENOMINATOR_PLURAL = {
  2: 'halves', 3: 'thirds', 4: 'quarters', 5: 'fifths',
  6: 'sixths', 7: 'sevenths', 8: 'eighths', 9: 'ninths', 10: 'tenths'
};

// ── Internal helpers ───────────────────────────────────────────────────────

/**
 * Convert a two-digit number (0-99) to English words.
 * @param {number} n
 * @returns {string}
 */
function twoDigitToWords(n) {
  if (n === 0) return '';
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return TENS[t] + (o ? '-' + ONES[o] : '');
}

// ── Cardinals ──────────────────────────────────────────────────────────────

/**
 * Convert a cardinal number to English words.
 * Supports 0 to 999,999.
 * @param {number} n
 * @returns {string}
 */
export function cardinalToWords(n) {
  if (n === 0) return 'zero';
  if (n < 0) return 'minus ' + cardinalToWords(-n);

  let result = '';

  if (n >= 1000000) {
    const millions = Math.floor(n / 1000000);
    result += cardinalToWords(millions) + ' million ';
    n = n % 1000000;
  }

  if (n >= 1000) {
    const thousands = Math.floor(n / 1000);
    result += cardinalToWords(thousands) + ' thousand ';
    n = n % 1000;
  }

  if (n >= 100) {
    const hundreds = Math.floor(n / 100);
    result += ONES[hundreds] + ' hundred ';
    n = n % 100;
    if (n > 0) result += 'and ';
  }

  if (n > 0) {
    result += twoDigitToWords(n);
  }

  return result.trim();
}

// ── Ordinals ───────────────────────────────────────────────────────────────

/**
 * Get ordinal suffix for a number (st, nd, rd, th).
 * @param {number} n
 * @returns {string}
 */
export function ordinalSuffix(n) {
  const lastTwo = n % 100;
  const lastDigit = n % 10;
  if (lastTwo >= 11 && lastTwo <= 13) return 'th';
  if (lastDigit === 1) return 'st';
  if (lastDigit === 2) return 'nd';
  if (lastDigit === 3) return 'rd';
  return 'th';
}

/**
 * Convert a number to its ordinal word form.
 * E.g. 1 -> "the first", 42 -> "the forty-second", 100 -> "the one hundredth"
 * @param {number} n - Number 1-100
 * @returns {string}
 */
export function ordinalToWords(n) {
  if (n <= 0) return 'the zeroth';

  // Handle 1-19 directly
  if (n < 20) {
    return 'the ' + ORDINAL_ONES[n];
  }

  // Handle exact tens: 20, 30, ... 90
  if (n < 100 && n % 10 === 0) {
    return 'the ' + ORDINAL_TENS[n / 10];
  }

  // Handle 21-99 compounds
  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    return 'the ' + TENS[t] + '-' + ORDINAL_ONES[o];
  }

  // Handle 100
  if (n === 100) {
    return 'the one hundredth';
  }

  return 'the ' + cardinalToWords(n) + 'th';
}

// ── Years ──────────────────────────────────────────────────────────────────

/**
 * Convert a year (1200-2026) to spoken English words.
 * E.g. 1987 -> "nineteen eighty-seven", 2000 -> "two thousand"
 * @param {number} year
 * @returns {string}
 */
export function yearToWords(year) {
  if (year === 2000) return 'two thousand';
  if (year >= 2001 && year <= 2009) return 'two thousand and ' + ONES[year - 2000];
  if (year >= 2010 && year <= 2099) return 'twenty ' + twoDigitToWords(year - 2000);

  const hi = Math.floor(year / 100);
  const lo = year % 100;
  const hiWords = twoDigitToWords(hi);

  if (lo === 0) return hiWords + ' hundred';
  if (lo < 10) return hiWords + ' oh ' + ONES[lo];
  return hiWords + ' ' + twoDigitToWords(lo);
}

// ── Decades ────────────────────────────────────────────────────────────────

/**
 * Convert a decade + qualifier to spoken English words.
 * E.g. (90, 'early') -> "the early nineties"
 * @param {number} decade - 50, 60, 70, 80, 90
 * @param {string} qualifier - 'early', 'mid', 'late'
 * @returns {string}
 */
export function decadeToWords(decade, qualifier) {
  const decadeIndex = decade / 10;
  const decadeWord = TENS_WORDS[decadeIndex] || (twoDigitToWords(decade) + 's');
  return 'the ' + qualifier + ' ' + decadeWord;
}

// ── Fractions ──────────────────────────────────────────────────────────────

/**
 * Convert a fraction to spoken English words.
 * E.g. (0, 1, 2) -> "one half", (2, 3, 4) -> "two and three quarters"
 * @param {number} whole - Whole number part (0 if none)
 * @param {number} num - Numerator
 * @param {number} den - Denominator
 * @returns {string}
 */
export function fractionToWords(whole, num, den) {
  if (whole > 0) {
    const wholeWord = cardinalToWords(whole);
    if (num === 1 && den === 2) return wholeWord + ' and a half';
    const fracPart = fractionPartToWords(num, den);
    return wholeWord + ' and ' + fracPart;
  }
  return fractionPartToWords(num, den);
}

/**
 * Convert just the fractional part to words.
 * @param {number} num - Numerator
 * @param {number} den - Denominator
 * @returns {string}
 */
function fractionPartToWords(num, den) {
  const numWord = cardinalToWords(num);
  if (num === 1) {
    return numWord + ' ' + DENOMINATOR_SINGULAR[den];
  }
  return numWord + ' ' + DENOMINATOR_PLURAL[den];
}

// ── Decimals ───────────────────────────────────────────────────────────────

/**
 * Convert a decimal number to spoken English words (digit-by-digit after point).
 * E.g. 1.36 -> "one point three six", 0.02 -> "nought point oh two"
 * @param {number} n
 * @returns {string}
 */
export function decimalToWords(n) {
  const str = n.toFixed(2);
  const parts = str.split('.');
  const intPart = parseInt(parts[0], 10);
  const fracStr = parts[1];

  // Integer part
  const intWord = intPart === 0 ? 'nought' : cardinalToWords(intPart);

  // Fractional part: digit-by-digit
  const fracDigits = fracStr.split('').map(d => {
    if (d === '0') return 'oh';
    return ONES[parseInt(d, 10)];
  });

  return intWord + ' point ' + fracDigits.join(' ');
}

// ── Currencies ─────────────────────────────────────────────────────────────

/**
 * Convert a dollar amount to spoken English words.
 * E.g. 5.35 -> "five dollars and thirty-five cents"
 * @param {number} amount
 * @returns {string}
 */
export function currencyToWords(amount) {
  const totalCents = Math.round(amount * 100);
  const dollars = Math.floor(totalCents / 100);
  const cents = totalCents % 100;

  if (dollars === 0 && cents === 0) return 'zero dollars';

  let result = '';

  if (dollars > 0) {
    result += cardinalToWords(dollars);
    result += dollars === 1 ? ' dollar' : ' dollars';
  }

  if (cents > 0) {
    if (dollars > 0) result += ' and ';
    result += cardinalToWords(cents);
    result += cents === 1 ? ' cent' : ' cents';
  }

  return result;
}

// ── Percentages ────────────────────────────────────────────────────────────

/**
 * Convert a percentage value to spoken English words.
 * Decimal part is read digit-by-digit.
 * E.g. 7.98 -> "seven point nine eight per cent", 50 -> "fifty per cent"
 * @param {number} n
 * @returns {string}
 */
export function percentageToWords(n) {
  // Check if it's a whole number
  if (Number.isInteger(n) || Math.abs(n - Math.round(n)) < 0.001) {
    const intWord = Math.round(n) === 0 ? 'nought' : cardinalToWords(Math.round(n));
    return intWord + ' per cent';
  }

  // Has decimal part
  const str = n.toFixed(2).replace(/0+$/, '');
  const parts = str.split('.');
  const intPart = parseInt(parts[0], 10);
  const fracStr = parts[1] || '';

  const intWord = intPart === 0 ? 'nought' : cardinalToWords(intPart);

  const fracDigits = fracStr.split('').map(d => {
    if (d === '0') return 'oh';
    return ONES[parseInt(d, 10)];
  });

  return intWord + ' point ' + fracDigits.join(' ') + ' per cent';
}

// ── Room/Bus Numbers ───────────────────────────────────────────────────────

/**
 * Convert a room/bus number to spoken English words with "oh" pronunciation.
 * E.g. ('room', 101) -> "room one oh one", ('bus', 305) -> "bus three oh five"
 * @param {string} type - 'room' or 'bus'
 * @param {number} number
 * @returns {string}
 */
export function roomBusToWords(type, number) {
  const hundreds = Math.floor(number / 100);
  const remainder = number % 100;
  const tens = Math.floor(remainder / 10);
  const units = remainder % 10;

  let numberWords;

  if (tens === 0 && units === 0) {
    // X00 — "one hundred"
    numberWords = ONES[hundreds] + ' hundred';
  } else if (tens === 0) {
    // X0Y — "one oh one" (the key "oh" pattern)
    numberWords = ONES[hundreds] + ' oh ' + ONES[units];
  } else if (units === 0) {
    // XY0 — "four ten", "two twenty"
    numberWords = ONES[hundreds] + ' ' + twoDigitToWords(remainder);
  } else {
    // XYZ — digit-by-digit or compound
    numberWords = ONES[hundreds] + ' ' + twoDigitToWords(remainder);
  }

  return type + ' ' + numberWords;
}

// ── Sports Scores ──────────────────────────────────────────────────────────

/**
 * Convert a sports score to spoken English words.
 * Uses "nil" for zero (British football context).
 * E.g. (5, 0) -> "five nil", (3, 3) -> "three all"
 * @param {number} home
 * @param {number} away
 * @returns {string}
 */
export function scoreToWords(home, away) {
  if (home === away) {
    if (home === 0) return 'nil nil';
    return cardinalToWords(home) + ' all';
  }

  const homeWord = home === 0 ? 'nil' : cardinalToWords(home);
  const awayWord = away === 0 ? 'nil' : cardinalToWords(away);

  return homeWord + ' ' + awayWord;
}

// ── Temperatures ───────────────────────────────────────────────────────────

/**
 * Convert a temperature to spoken English words.
 * E.g. -10 -> "minus ten degrees Celsius", 25 -> "twenty-five degrees"
 * @param {number} temp
 * @returns {string}
 */
export function temperatureToWords(temp) {
  const absWord = cardinalToWords(Math.abs(temp));

  let prefix = '';
  if (temp < 0) prefix = 'minus ';

  const degreeWord = Math.abs(temp) === 1 ? 'degree' : 'degrees';

  // Only add "Celsius" for negative or zero to emphasize scale
  if (temp <= 0) {
    return prefix + absWord + ' ' + degreeWord + ' Celsius';
  }
  return prefix + absWord + ' ' + degreeWord;
}

// ── Large Numbers (reuse cardinalToWords) ──────────────────────────────────

/**
 * Convert a large number to spoken English words.
 * Delegates to cardinalToWords.
 * @param {number} n
 * @returns {string}
 */
export function largeNumberToWords(n) {
  return cardinalToWords(n);
}
