import { cache } from "react";

import { supabase } from "@/lib/supabaseClient";
import { langToNatural } from "@/lib/utils";

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

  const name = `${challenge.title} (${langToNatural(challenge.language)})`;
  return {
    title: `${name} | AlgoType`,
    description: `Practice typing ${name} code on AlgoType`,
    alternates: { canonical: `https://algotype.net/${mode}/${slug}` },
  };
}
