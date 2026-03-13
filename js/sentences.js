// sentences.js — Sentence templates for each mode
// Templates use {N} for raw number and {YEAR_WORDS} for year-to-words conversion

import { yearToWords } from './confuser.js';

const TEMPLATES = {
  simple: [
    "The answer is {N}.",
    "Please go to room {N}.",
    "There are {N} students in the class.",
    "I need {N} copies of this document.",
    "The bus number is {N}.",
    "She scored {N} points on the test.",
    "We have {N} tickets left.",
    "Turn to page {N} in your textbook.",
    "The temperature today is {N} degrees.",
    "He ran {N} miles this morning.",
    "There are {N} people in the waiting room.",
    "Please take a number. You are number {N}.",
    "The speed limit here is {N} miles per hour.",
    "I counted {N} birds in the park.",
    "The train departs from platform {N}.",
    "We ordered {N} pizzas for the party.",
    "Your order number is {N}.",
    "The recipe calls for {N} grams of sugar.",
    "Gate {N} is now boarding.",
    "Channel {N} is showing the game tonight.",
    "The apartment is on floor {N}.",
    "I have {N} emails to respond to.",
    "There are {N} steps to the top.",
    "The parking spot is number {N}.",
    "We need {N} volunteers for the project.",
  ],
  years: [
    "She was born in {YEAR_WORDS}.",
    "The event took place in {YEAR_WORDS}.",
    "This building was constructed in {YEAR_WORDS}.",
    "The war ended in {YEAR_WORDS}.",
    "He graduated in {YEAR_WORDS}.",
    "The company was founded in {YEAR_WORDS}.",
    "They moved to America in {YEAR_WORDS}.",
    "The album was released in {YEAR_WORDS}.",
    "That law was passed in {YEAR_WORDS}.",
    "The bridge was built in {YEAR_WORDS}.",
    "The earthquake happened in {YEAR_WORDS}.",
    "She won the award in {YEAR_WORDS}.",
    "The treaty was signed in {YEAR_WORDS}.",
    "My parents got married in {YEAR_WORDS}.",
    "The film came out in {YEAR_WORDS}.",
    "The invention dates back to {YEAR_WORDS}.",
    "He started his career in {YEAR_WORDS}.",
    "The city was founded in {YEAR_WORDS}.",
    "The discovery was made in {YEAR_WORDS}.",
    "That tradition started in {YEAR_WORDS}.",
  ],
  large: [
    "The population is {N}.",
    "The total cost is {N} dollars.",
    "We received {N} applications.",
    "The distance is {N} meters.",
    "The stadium holds {N} people.",
    "The budget for this year is {N} dollars.",
    "They sold {N} copies in the first week.",
    "The elevation is {N} feet above sea level.",
    "There are {N} registered users.",
    "The area of the park is {N} square meters.",
    "His salary is {N} dollars per year.",
    "The factory produces {N} units per month.",
    "The file size is {N} kilobytes.",
    "We drove {N} kilometers on our trip.",
    "The library has {N} books.",
    "The donation totaled {N} dollars.",
    "The building is {N} square feet.",
    "About {N} people attended the concert.",
    "The project took {N} hours to complete.",
    "The weight is {N} grams.",
  ],
};

/**
 * Pick a random element from an array.
 */
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Determine which template set to use based on the target and mode.
 * For 'mixed' mode, infer the sub-mode from the number range.
 */
function getTemplateSet(target, mode) {
  if (mode === 'mixed') {
    if (target >= 1900 && target <= 2099) return 'years';
    if (target >= 100) return 'large';
    return 'simple';
  }
  return mode;
}

/**
 * Get a sentence with the target number substituted.
 * For years mode, uses yearToWords() for natural TTS pronunciation.
 * @param {number} target - The number to embed
 * @param {'simple'|'years'|'large'|'mixed'} mode
 * @returns {string} Complete sentence for TTS
 */
export function getSentence(target, mode) {
  const setKey = getTemplateSet(target, mode);
  const templates = TEMPLATES[setKey];
  const template = pick(templates);

  if (setKey === 'years') {
    const words = yearToWords(target);
    return template.replace('{YEAR_WORDS}', words);
  }

  return template.replace('{N}', String(target));
}
