import { cache } from "react";

import { supabase } from "@/lib/supabaseClient";
import { langToNatural } from "@/lib/utils";
import {
  CHALLENGE_LANGUAGES,
  challengeDescription,
  challengePath,
  challengeTitle,
  pageMetadata,
} from "@/lib/seo";

// Get one challenge by mode + slug (deduped between metadata and page render)
export const getChallenge = cache(async (mode, slug) => {
  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("mode", mode)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error("Failed to load challenge: " + error.message);
  return data;
});

// Page metadata for a challenge page
export async function getChallengeMetadata(mode, slug, fallback) {
  const challenge = await getChallenge(mode, slug);
  if (!challenge) return fallback;

  const language = langToNatural(challenge.language);
  const kind = mode === "algorithms" ? "LeetCode solution" : "source file";
  return pageMetadata({
    title: challengeTitle(challenge.title, language),
    description: challengeDescription(
      challenge.title,
      language,
      kind,
      challenge.lines,
    ),
    path: challengePath(mode, slug),
  });
}

// Every challenge of one mode + language, by title (for the server-rendered
// language index pages, so each challenge page has an internal link)
export const getChallengeList = cache(async (mode, language) => {
  const pageSize = 1000;
  const rows = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("challenges")
      .select("title, slug, lines")
      .eq("mode", mode)
      .eq("language", language)
      .order("title", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) throw new Error("Failed to list challenges: " + error.message);
    rows.push(...data);
    if (data.length < pageSize) break;
  }

  return rows;
});

// Languages that have at least one challenge in this mode, with counts
// Empty when Supabase is unreachable (CI builds use a placeholder URL), so
// the index page still renders with just its table
export const getModeLanguages = cache(async (mode) => {
  const counts = await Promise.all(
    CHALLENGE_LANGUAGES.map(async (language) => {
      const { count, error } = await supabase
        .from("challenges")
        .select("id", { count: "exact", head: true })
        .eq("mode", mode)
        .eq("language", language);
      if (error) {
        console.warn(`Failed to count ${mode}/${language}: ${error.message}`);
        return { language, count: 0 };
      }
      return { language, count };
    }),
  );
  return counts.filter((c) => c.count > 0);
});
