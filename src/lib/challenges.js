import { cache } from "react";

import { supabase } from "@/lib/supabaseClient";
import { langToNatural } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";

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
    title: `${challenge.title} (${language}) Typing Practice | AlgoType`,
    description: `Practice typing the ${challenge.title} ${kind} in ${language}: ${challenge.lines} lines of real code. Track your WPM and accuracy on AlgoType, typing practice for programmers.`,
    path: `/${mode}/${slug}`,
  });
}
