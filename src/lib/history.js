import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

// Validate and submit test result (when typing test finishes)
export async function submitTestHistory({
  wpm,
  acc,
  time,
  language,
  mode,
  slug,
}) {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("User must be authenticated to submit test history.");
    return { error: "Not authenticated" };
  }

  // Basic input validation
  if (
    typeof wpm !== "number" ||
    typeof acc !== "number" ||
    typeof time !== "number" ||
    typeof language !== "string" ||
    typeof mode !== "string" ||
    typeof slug !== "string"
  ) {
    console.error("Invalid data format for test history.");
    return { error: "Invalid data" };
  }

  // Insert into database
  const { error, data } = await supabase.from("history").insert([
    {
      user_id: user.id,
      wpm,
      acc,
      time,
      language,
      mode,
      slug,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Error inserting test history:", error.message);
    return { error: error.message };
  }

  return { success: true, data };
}

// Get recent test history for the current authenticated user
export async function getUserHistory(limit = 1000) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("history")
    .select("id, wpm, acc, time, language, mode, slug, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error("Failed to fetch history: " + error.message);
  }

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
    .select("id, wpm, acc, time, language, mode, slug, created_at", {
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
