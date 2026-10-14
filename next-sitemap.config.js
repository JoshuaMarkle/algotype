import { createClient } from "@supabase/supabase-js";

// Timed tests are /timed/<language>-<seconds> (src/lib/timed). Duplicated
// here because this config runs in plain Node without the `@/` alias
const TIMED_PATHS = ["python", "cpp", "java"].flatMap((language) =>
  [15, 30, 60].map((seconds) => ({ loc: `/timed/${language}-${seconds}` })),
);

// List every challenge page from Supabase (responses are capped at 1000 rows)
async function getChallengePaths() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const supabase = createClient(url, key);
  const pageSize = 1000;
  const paths = [];
  // Language index pages (/algorithms/language/python, ...)
  const hubs = new Set();

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("challenges")
      .select("mode, slug, language")
      .order("mode", { ascending: true })
      .order("slug", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) throw new Error(error.message);
    // Encoded: some slugs contain "?" or "%" (see challengePath in src/lib/seo)
    for (const { mode, slug, language } of data) {
      paths.push({ loc: `/${mode}/${encodeURIComponent(slug)}` });
      hubs.add(`/${mode}/language/${language}`);
    }
    if (data.length < pageSize) break;
  }

  return [...[...hubs].map((loc) => ({ loc })), ...paths];
}

export default {
  siteUrl: "https://algotype.net",
  generateRobotsTxt: true,
  outDir: "public",
  // Internal, private or one-off auth pages
  exclude: [
    "/colors",
    "/timed", // redirects to /timed/python-30
    "/account",
    "/settings",
    "/login",
    "/signup",
    "/login/password-reset*",
    "/login/verify-email",
    "/signup/success",
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
  },
  async additionalPaths() {
    try {
      return [...TIMED_PATHS, ...(await getChallengePaths())];
    } catch (err) {
      // Placeholder env (CI) or Supabase unreachable: keep the static pages
      console.warn("Sitemap: could not list challenges:", err.message);
      return TIMED_PATHS;
    }
  },
};
