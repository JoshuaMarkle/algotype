import { supabase } from "@/lib/supabaseClient";

const HISTORY_COLUMNS =
  "id, wpm, acc, time, language, lines, mode, slug, created_at";

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
    .select(HISTORY_COLUMNS);

  if (error) {
    console.error("Error inserting test history:", error.message);
    return { error: error.message };
  }

  // Prepend to cache. The insert bumped users.data_version by one, so the
  // cache stays valid unless another device also added a result.
  if (Array.isArray(data) && data[0]) {
    const next = addResultToCache(readCache(user.id), data[0]);
    if (next) writeCache(next);
  }

  return { success: true, data };
}

export const HISTORY_LIMIT = 1000; // Most recent rows kept in the cache

/**
 * Recent test history for the signed-in user, newest first, plus the total
 * number of results. Served from localStorage while users.data_version
 * matches the cached version (one tiny query); downloaded again otherwise.
 * @returns {Promise<{ history: object[], total: number }>}
 */
export async function loadUserHistory({ forceRefresh = false } = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) throw new Error("User not authenticated");

  const cached = readCache(userId);

  // Already checked during this page load
  if (!forceRefresh && cached && memChecked === userId) return cached;

  // Read the version before the rows: a result saved in between makes the
  // cache look older than it is (refetched next time), never newer
  const version = await fetchDataVersion(userId);
  if (!forceRefresh && isCacheCurrent(cached, { version, now: Date.now() })) {
    memChecked = userId;
    return cached;
  }

  const { data, error, count } = await supabase
    .from("history")
    .select(HISTORY_COLUMNS, { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(HISTORY_LIMIT);

  if (error) throw new Error("Failed to fetch history: " + error.message);

  const next = {
    userId,
    version,
    total: count ?? data.length,
    history: data,
    ts: Date.now(),
  };
  writeCache(next);
  memChecked = userId;
  return next;
}

// Recent test history for the signed-in user (newest first)
export async function getUserHistory(
  limit = HISTORY_LIMIT,
  forceRefresh = false,
) {
  const { history } = await loadUserHistory({ forceRefresh });
  return history.slice(0, limit);
}

// users.data_version changes whenever the user's history changes. Returns
// null if it cannot be read (offline, or the column does not exist yet).
async function fetchDataVersion(userId) {
  const { data, error } = await supabase
    .from("users")
    .select("data_version")
    .eq("id", userId)
    .maybeSingle();
  if (error || !Number.isInteger(data?.data_version)) return null;
  return data.data_version;
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
    .select(HISTORY_COLUMNS, { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error("Failed to fetch paginated history: " + error.message);
  }

  return { data, count };
}

// --- Cache History ---
// localStorage `algotype_history`: { userId, version, total, history, ts }
// with history most-recent-first (at most HISTORY_LIMIT rows)

const HISTORY_KEY = "algotype_history";
const FALLBACK_TTL = 1000 * 60; // Used only when data_version is unavailable

let memCache = null;
let memChecked = null; // user id whose cache was validated this page load

/**
 * Whether a cache can be used without downloading history again.
 * version: the current users.data_version, or null if unknown.
 */
export function isCacheCurrent(cache, { version, now }) {
  if (!cache) return false;
  if (version === null || version === undefined) {
    return now - (cache.ts ?? 0) < FALLBACK_TTL;
  }
  return cache.version === version;
}

// Cache after the user's own new result was saved
export function addResultToCache(cache, row, limit = HISTORY_LIMIT) {
  if (!cache) return null;
  return {
    ...cache,
    version: Number.isInteger(cache.version) ? cache.version + 1 : null,
    total: (cache.total ?? cache.history.length) + 1,
    history: [row, ...cache.history].slice(0, limit),
  };
}

function writeCache(cache) {
  memCache = cache;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(cache));
  } catch (_) {
    /* quota? ignore */
  }
}

function readCache(userId) {
  if (memCache?.userId === userId) return memCache;

  try {
    const cache = JSON.parse(localStorage.getItem(HISTORY_KEY));
    if (cache?.userId === userId && Array.isArray(cache.history)) {
      memCache = cache;
      return cache;
    }
  } catch {
    /* corrupted JSON */
  }
  return null;
}

export function clearHistoryCache() {
  memCache = null;
  memChecked = null;
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    /* ignore */
  }
}
