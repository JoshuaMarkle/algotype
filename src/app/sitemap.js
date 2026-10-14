import { unstable_cache } from "next/cache";

import { listChallenges, sitemapEntries } from "@/lib/sitemap";
import { supabase } from "@/lib/supabaseClient";

// Served per request so it follows the live `challenges` table without a
// redeploy (and the build never needs Supabase). The challenge list is cached
// for a day; a failed query is not cached, so the next crawl retries
export const dynamic = "force-dynamic";

const getChallenges = unstable_cache(
  () => listChallenges(supabase),
  ["sitemap-challenges"],
  { revalidate: 86400 },
);

export default async function sitemap() {
  return sitemapEntries(await getChallenges());
}
