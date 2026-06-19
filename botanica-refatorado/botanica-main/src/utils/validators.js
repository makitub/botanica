// src/utils/validators.js
export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isNonEmpty(value) {
  return Boolean(value && value.trim().length > 0);
}
