// storage.js — Safe localStorage wrapper with try/catch (EC-8)

const PREFIX = 'nlt_';

/**
 * Read a value from localStorage, JSON-parsed.
 * @param {string} key - Storage key (without prefix)
 * @param {*} defaultValue - Returned if key missing or parse fails
 * @returns {*}
 */
export function get(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

/**
 * Write a value to localStorage, JSON-stringified.
 * @param {string} key - Storage key (without prefix)
 * @param {*} value - Value to store
 * @returns {boolean} true if write succeeded
 */
export function set(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
