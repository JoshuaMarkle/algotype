import { supabase } from "@/lib/supabaseClient";

// Get a random challenge (with filters)
export async function getRandomTest(filters = {}) {
  let query = supabase
    .from("challenges")
    .select("id, title, lines, language, slug, mode, source, tokens")
    .order("RANDOM()")
    .limit(1);

  query = applyFilters(query, filters);

  const { data, error } = await query;

  if (error) {
    throw new Error("Failed to fetch random test: " + error.message);
  }

  return data?.[0] || null;
}

// Count how many challenges match the givin filters
export async function countMatchingTests(filters = {}) {
  let query = supabase
    .from("challenges")
    .select("*", { count: "exact", head: true });

  query = applyFilters(query, filters);

  const { count, error } = await query;

  if (error) {
    throw new Error("Failed to count tests: " + error.message);
  }

  return count ?? 0;
}

// --- Helper functions ---

// Apply the filters
function applyFilters(
  query,
  { mode, language, minLength = 0, maxLength = Infinity },
) {
  if (mode) query = query.eq("mode", mode);
  if (language) query = query.eq("language", language);
  if (minLength) query = query.gte("lines", minLength);
  if (maxLength !== Infinity) query = query.lte("lines", maxLength);
  return query;
}
