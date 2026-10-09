import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/lib/auth";

// Validate and submit test result (when typing test finishes)
export async function submitTestHistory({
  wpm,
  acc,
  time,
  language,
  lines,
  mode,
  slug,
}) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    // It is okay if a user is not authenticated
    // console.error("User must be authenticated to submit test history.");
    return { error: "Not authenticated" };
  }

  // Basic input validation
  if (
    typeof wpm !== "number" ||
    typeof acc !== "number" ||
    typeof time !== "number" ||
    typeof language !== "string" ||
    typeof lines !== "number" ||
    typeof mode !== "string" ||
    typeof slug !== "string"
  ) {
    console.error("Invalid data format for test history.");
    return { error: "Invalid data" };
  }

  // Insert into database
  const { error, data } = await supabase
    .from("history")
    .insert([
      {
        user_id: user.id,
        wpm,
        acc,
        time,
        language,
        lines,
        mode,
        slug,
        created_at: new Date().toISOString(),
      },
    ])
    .select("id, wpm, acc, time, language, lines, mode, slug, created_at");

  if (error) {
    console.error("Error inserting test history:", error.message);
    return { error: error.message };
  }

  // Prepend to cache
  const cached = readCache();
  if (cached && Array.isArray(data) && data[0]) {
    writeCache([{ ...data[0] }, ...cached]);
  }

  return { success: true, data };
}

// Get recent test history for the current authenticated user
export async function getUserHistory(limit = 1000, forceRefresh = false) {
  const user = await getCurrentUser();
  if (!user) throw new Error("User not authenticated");

  if (!forceRefresh) {
    const cached = readCache();
    if (cached) return cached.slice(0, limit); // Instant resolve
  }

  const { data, error } = await supabase
    .from("history")
    .select("id, wpm, acc, time, language, lines, mode, slug, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error("Failed to fetch history: " + error.message);

  writeCache(data); // Update both memory + localStorage
  return data;
}

// Paginate test history for the user (for tables, infinite scroll, etc.)
export async function getUserHistoryPaginated({ page = 0, pageSize = 20 }) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("history")
    .select("id, wpm, acc, time, language, lines, mode, slug, created_at", {
      count: "exact",
    })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error("Failed to fetch paginated history: " + error.message);
  }

  return { data, count };
}

// --- Cache History ---
// (most-recent-first ordering)

const HISTORY_KEY = "algotype_history";
const HISTORY_TTL = 1000 * 60; // 60 s freshness window

// Internal in-memory store
let memCache = null;
let memTs = 0;

function writeCache(history) {
  memCache = history;
  memTs = Date.now();
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify({ ts: memTs, history }));
  } catch (_) {
    /* quota? ignore */
  }
}

function readCache() {
  // Memory first
  if (memCache && Date.now() - memTs < HISTORY_TTL) return memCache;

  // Then localStorage
  const raw = localStorage.getItem(HISTORY_KEY);
  if (!raw) return null;
  try {
    const { ts, history } = JSON.parse(raw);
    if (Date.now() - ts < HISTORY_TTL) {
      memCache = history; // Warm memory copy
      memTs = ts;
      return history;
    }
  } catch {
    /* corrupted JSON */
  }

  localStorage.removeItem(HISTORY_KEY);
  return null;
}

export function clearHistoryCache() {
  memCache = null;
  memTs = 0;
  localStorage.removeItem(HISTORY_KEY);
}
