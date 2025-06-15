import { supabase } from "@/lib/supabaseClient";

// Go to a random challenge
export async function gotoRandomTest(filters = {}) {
  try {
    const test = await getRandomTest(filters);
    if (!test) {
      alert("No matching test found.");
      return;
    }

    const { mode, slug } = test;
    window.location.href = `/${mode}/${slug}`;
  } catch (err) {
    console.error("Failed to go to random test:", err.message);
    alert("Failed to load a random test.");
  }
}

// Count how many challenges match the givin filters
export async function countMatchingTests(filters = {}) {
  const { minLength, maxLength, language, mode } = filters;

  const { data, error } = await supabase.rpc("count_matching_challenges", {
    _min_length: minLength ?? null,
    _max_length: maxLength ?? null,
    _language: language ?? null,
    _mode: mode ?? null,
  });

  if (error) {
    throw new Error("Failed to count tests: " + error.message);
  }

  return data ?? 0;
}

// --- Helper functions ---

// Get a single random challenge using a RPC function
async function getRandomTest(filters = {}) {
  const { minLength, maxLength, language, mode } = filters;

  const { data, error } = await supabase.rpc("get_random_challenge", {
    _min_length: minLength ?? null,
    _max_length: maxLength ?? null,
    _language: language ?? null,
    _mode: mode ?? null,
  });

  if (error) {
    throw new Error("Failed to fetch random test: " + error.message);
  }

  return data?.[0] || null;
}

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
