export const SETTINGS_KEY = "algotype_settings";
export const DEFAULT_SETTINGS = Object.freeze({
  syntax_highlighting: true,
  line_numbers: true,
  theme: "default",
});

let cache = null;
const listeners = new Set();

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
 * Update one or many settings. Stamps `updated_at` so the newest copy wins
 * when settings are synced with the account (see src/lib/preferences.js).
 * @param {object|string} key   either an object of updates or a single key
 * @param {any}           value value for single-key form
 */
export function setSetting(key, value) {
  // Normalize to object form
  const updates = typeof key === "object" ? key : { [key]: value };
  return writeSettings(
    { ...getSettings(), ...updates, updated_at: Date.now() },
    "local",
  );
}

// Replace all settings with a copy from the account (keeps its timestamp)
export function replaceSettings(settings) {
  return writeSettings({ ...DEFAULT_SETTINGS, ...settings }, "remote");
}

// Listen for setting changes; returns an unsubscribe function.
// source is "local" (changed in this tab) or "remote" (synced from account).
export function onSettingsChange(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Wipe everything
export function clearSettings() {
  cache = null;
  localStorage.removeItem(SETTINGS_KEY);
}

function writeSettings(settings, source) {
  cache = settings;

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* Quota exceeded? ignore  */
  }

  for (const listener of listeners) listener(settings, source);
  return settings;
}

// --- Account sync helpers (pure) ---

// Keep only known keys whose type matches the default, plus updated_at
export function sanitizeSettings(input) {
  const out = {};
  if (!input || typeof input !== "object") return out;

  for (const [key, def] of Object.entries(DEFAULT_SETTINGS)) {
    if (typeof input[key] === typeof def) out[key] = input[key];
  }
  if (Number.isFinite(input.updated_at)) out.updated_at = input.updated_at;
  return out;
}

/**
 * Decide how local and account settings combine: the copy changed most
 * recently wins. A copy that was never changed has updated_at 0.
 * @returns {{ action: "none" | "pull" | "push", settings: object }}
 */
export function mergeSettings(local, remote) {
  const l = sanitizeSettings(local);
  const r = sanitizeSettings(remote);
  const lt = l.updated_at ?? 0;
  const rt = r.updated_at ?? 0;

  if (rt > lt) {
    return { action: "pull", settings: { ...DEFAULT_SETTINGS, ...r } };
  }
  if (lt > rt) {
    return { action: "push", settings: { ...DEFAULT_SETTINGS, ...l } };
  }
  return { action: "none", settings: { ...DEFAULT_SETTINGS, ...l } };
}
