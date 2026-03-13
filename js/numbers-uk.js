// numbers-uk.js — Ukrainian number-to-words functions
// All functions produce TTS-ready text strings for the Web Speech API
// CRITICAL: Ukrainian has grammatical gender, complex declensions, and irregular forms

// ── Gender constants ───────────────────────────────────────────────────────

const MASCULINE = 'm';
const FEMININE = 'f';
const NEUTER = 'n';

// ── Lookup tables ──────────────────────────────────────────────────────────

const ONES_M = [
  'нуль', 'один', 'два', 'три', 'чотири', "п'ять", 'шість', 'сім',
  'вісім', "дев'ять", 'десять', 'одинадцять', 'дванадцять',
  'тринадцять', 'чотирнадцять', "п'ятнадцять",
  'шістнадцять', 'сімнадцять', 'вісімнадцять', "дев'ятнадцять"
];

const ONES_F = [
  'нуль', 'одна', 'дві', 'три', 'чотири', "п'ять", 'шість', 'сім',
  'вісім', "дев'ять", 'десять', 'одинадцять', 'дванадцять',
  'тринадцять', 'чотирнадцять', "п'ятнадцять",
  'шістнадцять', 'сімнадцять', 'вісімнадцять', "дев'ятнадцять"
];

const ONES_N = [
  'нуль', 'одне', 'два', 'три', 'чотири', "п'ять", 'шість', 'сім',
  'вісім', "дев'ять", 'десять', 'одинадцять', 'дванадцять',
  'тринадцять', 'чотирнадцять', "п'ятнадцять",
  'шістнадцять', 'сімнадцять', 'вісімнадцять', "дев'ятнадцять"
];

const TENS = [
  '', '', 'двадцять', 'тридцять', 'сорок', "п'ятдесят",
  'шістдесят', 'сімдесят', 'вісімдесят', "дев'яносто"
];

const HUNDREDS = [
  '', 'сто', 'двісті', 'триста', 'чотириста', "п'ятсот",
  'шістсот', 'сімсот', 'вісімсот', "дев'ятсот"
];

// ── Ordinals ───────────────────────────────────────────────────────────────

const ORDINAL_ONES = [
  '', 'перший', 'другий', 'третій', 'четвертий',
  "п'ятий", 'шостий', 'сьомий', 'восьмий', "дев'ятий"
];

const ORDINAL_TEENS = [
  'десятий', 'одинадцятий', 'дванадцятий', 'тринадцятий',
  'чотирнадцятий', "п'ятнадцятий", 'шістнадцятий',
  'сімнадцятий', 'вісімнадцятий', "дев'ятнадцятий"
];

const ORDINAL_TENS = [
  '', '', 'двадцятий', 'тридцятий', 'сороковий', "п'ятдесятий",
  'шістдесятий', 'сімдесятий', 'вісімдесятий', "дев'яностий"
];

const ORDINAL_HUNDREDS = [
  '', 'сотий', 'двохсотий', 'трьохсотий', 'чотирьохсотий',
  "п'ятисотий", 'шестисотий', 'семисотий', 'восьмисотий', "дев'ятисотий"
];

// ── Decade words ───────────────────────────────────────────────────────────

const DECADE_ORDINAL_GENITIVE_PLURAL = {
  5: "п'ятдесятих",
  6: 'шістдесятих',
  7: 'сімдесятих',
  8: 'вісімдесятих',
  9: "дев'яностих"
};

const DECADE_QUALIFIERS = {
  early: 'початок',
  mid: 'середина',
  late: 'кінець'
};

// ── Fraction denominator forms ─────────────────────────────────────────────

// Nominative feminine singular (for numerator 1: "одна друга")
const DENOM_NOM_F_SG = {
  2: 'друга', 3: 'третя', 4: 'четверта', 5: "п'ята",
  6: 'шоста', 7: 'сьома', 8: 'восьма', 9: "дев'ята", 10: 'десята'
};

// Genitive plural (for numerator 2+: "дві третіх")
const DENOM_GEN_PL = {
  2: 'других', 3: 'третіх', 4: 'четвертих', 5: "п'ятих",
  6: 'шостих', 7: 'сьомих', 8: 'восьмих', 9: "дев'ятих", 10: 'десятих'
};

// ── Internal helpers ───────────────────────────────────────────────────────

/**
 * Get the ones array for the specified gender.
 * @param {string} gender - 'm', 'f', or 'n'
 * @returns {string[]}
 */
function onesForGender(gender) {
  if (gender === FEMININE) return ONES_F;
  if (gender === NEUTER) return ONES_N;
  return ONES_M;
}

/**
 * Convert a two-digit number (0-99) to Ukrainian words.
 * @param {number} n
 * @param {string} gender - 'm', 'f', or 'n'
 * @returns {string}
 */
function twoDigitToWords(n, gender) {
  if (n === 0) return '';
  const ones = onesForGender(gender);
  if (n < 20) return ones[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  if (o === 0) return TENS[t];
  return TENS[t] + ' ' + ones[o];
}

/**
 * Convert a number up to 999 to Ukrainian words.
 * @param {number} n - Number 0-999
 * @param {string} gender - 'm', 'f', or 'n'
 * @returns {string}
 */
function threeDigitToWords(n, gender) {
  if (n === 0) return '';
  const parts = [];
  const h = Math.floor(n / 100);
  if (h > 0) parts.push(HUNDREDS[h]);
  const rem = n % 100;
  if (rem > 0) parts.push(twoDigitToWords(rem, gender));
  return parts.join(' ');
}

/**
 * Determine the declension case for a number (Ukrainian rules).
 * Returns 1, 2, or 5 to indicate the declension pattern.
 * 1 = singular (1, 21, 31...), 2 = paucal (2-4, 22-24...), 5 = plural (5-20, 25-30...)
 * @param {number} n - Absolute value of the number
 * @returns {number}
 */
function getDeclensionCase(n) {
  const abs = Math.abs(n);
  const lastTwo = abs % 100;
  const lastOne = abs % 10;
  if (lastTwo >= 11 && lastTwo <= 19) return 5;
  if (lastOne === 1) return 1;
  if (lastOne >= 2 && lastOne <= 4) return 2;
  return 5;
}

/**
 * Decline a noun based on the number preceding it.
 * @param {number} n
 * @param {string} form1 - Nominative singular (1)
 * @param {string} form2 - Nominative plural (2-4)
 * @param {string} form5 - Genitive plural (5-20)
 * @returns {string}
 */
function decline(n, form1, form2, form5) {
  const c = getDeclensionCase(n);
  if (c === 1) return form1;
  if (c === 2) return form2;
  return form5;
}

// ── Cardinals ──────────────────────────────────────────────────────────────

/**
 * Convert a cardinal number to Ukrainian words.
 * Supports 0 to 999,999.
 * @param {number} n
 * @param {string} [gender='m'] - Grammatical gender: 'm', 'f', or 'n'
 * @returns {string}
 */
export function cardinalToWords(n, gender = MASCULINE) {
  if (n === 0) return 'нуль';
  if (n < 0) return 'мінус ' + cardinalToWords(-n, gender);

  const parts = [];

  if (n >= 1000000) {
    const millions = Math.floor(n / 1000000);
    // "мільйон" is masculine
    parts.push(threeDigitToWords(millions, MASCULINE));
    parts.push(decline(millions, 'мільйон', 'мільйони', 'мільйонів'));
    n = n % 1000000;
    if (n === 0) return parts.join(' ');
  }

  if (n >= 1000) {
    const thousands = Math.floor(n / 1000);
    // "тисяча" is feminine — use feminine gender for the number before it
    parts.push(threeDigitToWords(thousands, FEMININE));
    parts.push(decline(thousands, 'тисяча', 'тисячі', 'тисяч'));
    n = n % 1000;
    if (n === 0) return parts.join(' ');
  }

  // Remaining 0-999 uses the requested gender
  if (n > 0) {
    parts.push(threeDigitToWords(n, gender));
  }

  return parts.join(' ');
}

// ── Ordinals ───────────────────────────────────────────────────────────────

/**
 * Convert a number to its Ukrainian ordinal word form.
 * For compound ordinals (21-99), the last part is ordinal, the rest is cardinal.
 * @param {number} n - Number 1-1000+
 * @returns {string}
 */
export function ordinalToWords(n) {
  if (n <= 0) return 'нульовий';

  if (n < 10) return ORDINAL_ONES[n];
  if (n >= 10 && n <= 19) return ORDINAL_TEENS[n - 10];

  if (n < 100) {
    const t = Math.floor(n / 10);
    const o = n % 10;
    if (o === 0) return ORDINAL_TENS[t];
    return TENS[t] + ' ' + ORDINAL_ONES[o];
  }

  if (n < 1000) {
    const h = Math.floor(n / 100);
    const rem = n % 100;
    if (rem === 0) return ORDINAL_HUNDREDS[h];
    return HUNDREDS[h] + ' ' + ordinalToWords(rem);
  }

  if (n < 10000) {
    const th = Math.floor(n / 1000);
    const rem = n % 1000;
    if (rem === 0) {
      if (th === 1) return 'тисячний';
      // e.g. 2000 → "двотисячний"
      return threeDigitToWords(th, MASCULINE) + 'тисячний';
    }
    // For non-round: cardinal thousands + ordinal remainder
    const thousandPart = threeDigitToWords(th, FEMININE) + ' ' + decline(th, 'тисяча', 'тисячі', 'тисяч');
    return thousandPart + ' ' + ordinalToWords(rem);
  }

  return cardinalToWords(n, MASCULINE);
}

/**
 * Ukrainian ordinal display suffix.
 * In Ukrainian, ordinals are written as "1-й", "2-й", "3-й" etc.
 * @param {number} _n
 * @returns {string}
 */
export function ordinalSuffix(_n) {
  return '-й';
}

// ── Years ──────────────────────────────────────────────────────────────────

/**
 * Convert a year (1000-2099) to spoken Ukrainian words.
 * Uses cardinal pronunciation common in speech.
 * E.g. 1987→"тисяча дев'ятсот вісімдесят сім"
 *      2024→"дві тисячі двадцять чотири"
 *      2000→"дві тисячі"
 *      1900→"тисяча дев'ятсот"
 * @param {number} year
 * @returns {string}
 */
export function yearToWords(year) {
  // Use cardinal form for years (common in spoken Ukrainian)
  // Drop "одна" before "тисяча" — in spoken Ukrainian years it's just "тисяча"
  const result = cardinalToWords(year, MASCULINE);
  return result.replace(/^одна тисяча/, 'тисяча');
}

// ── Decades ────────────────────────────────────────────────────────────────

/**
 * Convert a decade + qualifier to spoken Ukrainian words.
 * E.g. (90, 'early') → "початок дев'яностих"
 * @param {number} decade - 50, 60, 70, 80, 90
 * @param {string} qualifier - 'early', 'mid', 'late'
 * @returns {string}
 */
export function decadeToWords(decade, qualifier) {
  const decadeIndex = decade / 10;
  const decadeWord = DECADE_ORDINAL_GENITIVE_PLURAL[decadeIndex] || (twoDigitToWords(decade, MASCULINE) + 'их');
  const qualifierWord = DECADE_QUALIFIERS[qualifier] || qualifier;
  return qualifierWord + ' ' + decadeWord;
}

// ── Fractions ──────────────────────────────────────────────────────────────

/**
 * Convert a fraction to spoken Ukrainian words (mathematical style).
 * E.g. (0, 1, 2) → "одна друга", (0, 2, 3) → "дві третіх"
 *      (2, 3, 4) → "дві цілих три четвертих"
 * @param {number} whole - Whole number part (0 if none)
 * @param {number} num - Numerator
 * @param {number} den - Denominator
 * @returns {string}
 */
export function fractionToWords(whole, num, den) {
  if (whole > 0) {
    // "ціла" (1), "цілих" (0, 2+)
    const wholeWord = cardinalToWords(whole, FEMININE);
    const wholeDecl = decline(whole, 'ціла', 'цілих', 'цілих');
    const fracPart = fractionPartToWords(num, den);
    return wholeWord + ' ' + wholeDecl + ' ' + fracPart;
  }
  return fractionPartToWords(num, den);
}

/**
 * Convert just the fractional part to Ukrainian words.
 * Numerator is always feminine (agrees with the implied "частина" / fractional form).
 * @param {number} num - Numerator
 * @param {number} den - Denominator
 * @returns {string}
 */
function fractionPartToWords(num, den) {
  // Numerator in feminine
  const numWord = cardinalToWords(num, FEMININE);

  if (num === 1) {
    // "одна друга", "одна третя", "одна четверта"
    return numWord + ' ' + (DENOM_NOM_F_SG[den] || ordinalFemSg(den));
  }
  // "дві третіх", "три четвертих", "п'ять восьмих"
  return numWord + ' ' + (DENOM_GEN_PL[den] || ordinalGenPl(den));
}

/**
 * Generate ordinal feminine singular for denominators not in the lookup table.
 * @param {number} den
 * @returns {string}
 */
function ordinalFemSg(den) {
  // Fallback for denominators > 10
  const ord = ordinalToWords(den);
  // Convert masculine ending to feminine: -ий → -а, -ій → -я
  return ord.replace(/ий$/, 'а').replace(/ій$/, 'я');
}

/**
 * Generate ordinal genitive plural for denominators not in the lookup table.
 * @param {number} den
 * @returns {string}
 */
function ordinalGenPl(den) {
  const ord = ordinalToWords(den);
  return ord.replace(/ий$/, 'их').replace(/ій$/, 'іх');
}

// ── Decimals ───────────────────────────────────────────────────────────────

/**
 * Convert a decimal number to spoken Ukrainian words (mathematical style).
 * E.g. 1.36 → "одна ціла тридцять шість сотих"
 *      0.5  → "нуль цілих п'ять десятих"
 *      0.02 → "нуль цілих дві сотих"
 * @param {number} n
 * @returns {string}
 */
export function decimalToWords(n) {
  const str = n.toFixed(2);
  const parts = str.split('.');
  const intPart = parseInt(parts[0], 10);
  const fracStr = parts[1];
  const fracNum = parseInt(fracStr, 10);

  // Integer part — feminine because "ціла" is feminine
  const intWord = intPart === 0 ? 'нуль' : cardinalToWords(intPart, FEMININE);
  const wholeDecl = decline(intPart, 'ціла', 'цілих', 'цілих');

  if (fracNum === 0) {
    return intWord + ' ' + wholeDecl;
  }

  // Determine denominator word based on decimal places
  let denomSg, denomPl;
  if (fracStr.length === 1 || (fracStr.length === 2 && fracStr[1] === '0')) {
    // Tenths
    denomSg = 'десята';
    denomPl = 'десятих';
  } else if (fracStr.length === 2) {
    // Hundredths
    denomSg = 'сота';
    denomPl = 'сотих';
  } else {
    // Thousandths
    denomSg = 'тисячна';
    denomPl = 'тисячних';
  }

  // Handle trailing zeros for tenths: 0.50 → "п'ять десятих", not "п'ятдесят сотих"
  let actualFracNum = fracNum;
  let useTenths = false;
  if (fracStr.length === 2 && fracStr[1] === '0' && fracStr[0] !== '0') {
    actualFracNum = parseInt(fracStr[0], 10);
    useTenths = true;
    denomSg = 'десята';
    denomPl = 'десятих';
  }

  // Fractional numerator is feminine (agrees with denominator which is feminine adjective)
  const fracWord = cardinalToWords(actualFracNum, FEMININE);
  const fracDecl = getDeclensionCase(actualFracNum) === 1 ? denomSg : denomPl;

  return intWord + ' ' + wholeDecl + ' ' + fracWord + ' ' + fracDecl;
}

// ── Currencies ─────────────────────────────────────────────────────────────

/**
 * Convert a hryvnia amount to spoken Ukrainian words.
 * E.g. 1.00 → "одна гривня"
 *      2.50 → "дві гривні п'ятдесят копійок"
 *      5.35 → "п'ять гривень тридцять п'ять копійок"
 *      21.01 → "двадцять одна гривня одна копійка"
 * @param {number} amount
 * @returns {string}
 */
export function currencyToWords(amount) {
  const totalKopiyok = Math.round(amount * 100);
  const hryvni = Math.floor(totalKopiyok / 100);
  const kopiyky = totalKopiyok % 100;

  if (hryvni === 0 && kopiyky === 0) return 'нуль гривень';

  let result = '';

  if (hryvni > 0) {
    // "гривня" is feminine
    result += cardinalToWords(hryvni, FEMININE);
    result += ' ' + decline(hryvni, 'гривня', 'гривні', 'гривень');
  }

  if (kopiyky > 0) {
    if (hryvni > 0) result += ' ';
    // "копійка" is feminine
    result += cardinalToWords(kopiyky, FEMININE);
    result += ' ' + decline(kopiyky, 'копійка', 'копійки', 'копійок');
  }

  return result;
}

// ── Percentages ────────────────────────────────────────────────────────────

/**
 * Convert a percentage value to spoken Ukrainian words.
 * E.g. 1 → "один відсоток", 5 → "п'ять відсотків"
 *      7.98 → "сім цілих дев'яносто вісім сотих відсотка"
 * @param {number} n
 * @returns {string}
 */
export function percentageToWords(n) {
  // "відсоток" is masculine
  if (Number.isInteger(n) || Math.abs(n - Math.round(n)) < 0.001) {
    const rounded = Math.round(n);
    const numWord = cardinalToWords(rounded, MASCULINE);
    return numWord + ' ' + decline(rounded, 'відсоток', 'відсотки', 'відсотків');
  }

  // Decimal percentage: "сім цілих дев'яносто вісім сотих відсотка"
  const decWord = decimalToWords(n);
  return decWord + ' відсотка';
}

// ── Room/Bus Numbers ───────────────────────────────────────────────────────

/**
 * Convert a room/bus number to spoken Ukrainian words.
 * E.g. ('room', 101) → "кімната сто один", ('bus', 602) → "автобус шістсот два"
 * @param {string} type - 'room' or 'bus'
 * @param {number} number
 * @returns {string}
 */
export function roomBusToWords(type, number) {
  const label = type === 'room' ? 'кімната' : 'автобус';
  return label + ' ' + cardinalToWords(number, MASCULINE);
}

// ── Sports Scores ──────────────────────────────────────────────────────────

/**
 * Convert a sports score to spoken Ukrainian words.
 * E.g. (5, 0) → "п'ять нуль", (2, 2) → "два два"
 * @param {number} home
 * @param {number} away
 * @returns {string}
 */
export function scoreToWords(home, away) {
  const homeWord = home === 0 ? 'нуль' : cardinalToWords(home, MASCULINE);
  const awayWord = away === 0 ? 'нуль' : cardinalToWords(away, MASCULINE);
  return homeWord + ' ' + awayWord;
}

// ── Temperatures ───────────────────────────────────────────────────────────

/**
 * Convert a temperature to spoken Ukrainian words.
 * E.g. -10 → "мінус десять градусів Цельсія"
 *      1 → "один градус Цельсія"
 *      21 → "двадцять один градус Цельсія"
 * @param {number} temp
 * @returns {string}
 */
export function temperatureToWords(temp) {
  let prefix = '';
  if (temp < 0) prefix = 'мінус ';

  const absTemp = Math.abs(temp);
  // "градус" is masculine
  const numWord = absTemp === 0 ? 'нуль' : cardinalToWords(absTemp, MASCULINE);
  const degreeWord = decline(absTemp, 'градус', 'градуси', 'градусів');

  return prefix + numWord + ' ' + degreeWord + ' Цельсія';
}

// ── Large Numbers ──────────────────────────────────────────────────────────

/**
 * Convert a large number to spoken Ukrainian words.
 * @param {number} n
 * @returns {string}
 */
export function largeNumberToWords(n) {
  return cardinalToWords(n, MASCULINE);
}
