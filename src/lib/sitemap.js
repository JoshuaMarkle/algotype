import { DRILL_LANGUAGES, DRILL_TYPES, drillSlug } from "@/lib/drills";
import { CHALLENGE_LANGUAGES, SITE_URL, challengePath } from "@/lib/seo";
import { TIMED_DURATIONS, TIMED_LANGUAGES, timedSlug } from "@/lib/timed";

// Indexable pages that are not challenges. Left out on purpose: /timed
// (redirects), /colors (noindex), account, settings and auth pages
export const STATIC_PATHS = [
  "/",
  "/homepage",
  "/algorithms",
  "/files",
  "/drills",
  "/feedback",
  "/privacy",
  "/terms",
];

// One drill page per language and type. Multi-type combinations are valid
// URLs but near duplicates of these, so they stay out of the sitemap
export function drillPaths() {
  return DRILL_LANGUAGES.flatMap((language) =>
    DRILL_TYPES.map((type) => `/drills/${drillSlug(language, [type.id])}`),
  );
}

export function timedPaths() {
  return TIMED_LANGUAGES.flatMap((language) =>
    TIMED_DURATIONS.map((seconds) => `/timed/${timedSlug(language, seconds)}`),
  );
}

// Every challenge as { mode, slug, language }. Supabase caps responses at 1000 rows
const PAGE_SIZE = 1000;

export async function listChallenges(supabase) {
  const challenges = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("challenges")
      .select("mode, slug, language")
      .order("mode", { ascending: true })
      .order("slug", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw new Error("Failed to list challenges: " + error.message);
    challenges.push(...data);
    if (data.length < PAGE_SIZE) return challenges;
  }
}

// Language index pages (/algorithms/language/python, ...) for every mode and
// language that has challenges, so the list follows the table
export function languageHubPaths(challenges) {
  // The hub pages 404 for languages outside CHALLENGE_LANGUAGES
  const hubs = new Set(
    challenges
      .filter(({ language }) => CHALLENGE_LANGUAGES.includes(language))
      .map(({ mode, language }) => `/${mode}/language/${language}`),
  );
  return [...hubs];
}

// Sitemap entries for app/sitemap.js. No lastmod: challenges carry no
// timestamp, and a build or request time would tell crawlers nothing
export function sitemapEntries(challenges) {
  const paths = [
    ...STATIC_PATHS,
    ...drillPaths(),
    ...timedPaths(),
    ...languageHubPaths(challenges),
    ...challenges.map(({ mode, slug }) => challengePath(mode, slug)),
  ];
  return paths.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
  }));
}
