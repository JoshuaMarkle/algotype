import { supabase } from "@/lib/supabaseClient";
import {
  getSettings,
  mergeSettings,
  onSettingsChange,
  replaceSettings,
  sanitizeSettings,
} from "@/lib/settings";

// Syncs src/lib/settings.js with users.preferences for signed-in users.
// The account copy is read once per browser session (and on sign-in); local
// changes are pushed shortly after they happen. Newest updated_at wins.

const SYNCED_KEY = "algotype_prefs_synced"; // sessionStorage: synced user id
const PUSH_DELAY_MS = 1000;

let pushTimer = null;
let started = false;

// Pull or push once for the signed-in user (no-op if already done this session)
export async function syncPreferences({ force = false } = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) return;

  if (!force && readSynced() === userId) return;

  const { data, error } = await supabase
    .from("users")
    .select("preferences")
    .eq("id", userId)
    .maybeSingle();

  // Column missing (migration not applied) or offline: keep local settings
  if (error || !data) return;

  const { action, settings } = mergeSettings(getSettings(), data.preferences);
  if (action === "pull") replaceSettings(settings);
  if (action === "push") await pushPreferences();

  writeSynced(userId);
}

export async function pushPreferences() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return;

  const { error } = await supabase.rpc("save_preferences", {
    _preferences: sanitizeSettings(getSettings()),
  });
  if (error) console.warn("Could not save preferences:", error.message);
}

// Start syncing: pull now, again on sign-in, and push local changes
export function startPreferenceSync() {
  if (started) return () => {};
  started = true;

  syncPreferences();

  const { data: listener } = supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN") setTimeout(() => syncPreferences(), 0);
    if (event === "SIGNED_OUT") clearSynced();
  });

  const unsubscribe = onSettingsChange((_settings, source) => {
    if (source !== "local") return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(pushPreferences, PUSH_DELAY_MS);
  });

  return () => {
    started = false;
    listener?.subscription?.unsubscribe();
    unsubscribe();
    clearTimeout(pushTimer);
  };
}

function readSynced() {
  try {
    return sessionStorage.getItem(SYNCED_KEY);
  } catch {
    return null;
  }
}

function writeSynced(userId) {
  try {
    sessionStorage.setItem(SYNCED_KEY, userId);
  } catch {
    /* ignore */
  }
}

export function clearSynced() {
  try {
    sessionStorage.removeItem(SYNCED_KEY);
  } catch {
    /* ignore */
  }
}
