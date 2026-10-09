const SETTINGS_KEY = "algotype_settings";
export const DEFAULT_SETTINGS = Object.freeze({
  syntax_highlighting: true,
  line_numbers: true,
});

let cache = null;

// Read settings
export function getSettings() {
  if (cache) return cache;
  if (typeof window === "undefined") return DEFAULT_SETTINGS;

  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    // Merge with defaults so missing keys fall back
    cache = { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    // Malformed JSON or unavailable (SSR) - just defaults
    cache = { ...DEFAULT_SETTINGS };
  }

  return cache;
}

/**
 * Update one or many settings.
 * @param {object|string} key   either an object of updates or a single key
 * @param {any}           value value for single-key form
 */
export function setSetting(key, value) {
  // Normalize to object form
  const updates = typeof key === "object" ? key : { [key]: value };

  // Update memory
  const settings = { ...getSettings(), ...updates };
  cache = settings;

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* Quota exceeded? ignore  */
  }

  return settings;
}

// Wipe everything
export function clearSettings() {
  cache = null;
  localStorage.removeItem(SETTINGS_KEY);
}
