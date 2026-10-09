import { createClient } from "@supabase/supabase-js";

// List every challenge page from Supabase (responses are capped at 1000 rows)
async function getChallengePaths() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];

  const supabase = createClient(url, key);
  const pageSize = 1000;
  const paths = [];

  for (let from = 0; ; from += pageSize) {
    const { data, error } = await supabase
      .from("challenges")
      .select("mode, slug")
      .order("mode", { ascending: true })
      .order("slug", { ascending: true })
      .range(from, from + pageSize - 1);

    if (error) throw new Error(error.message);
    for (const { mode, slug } of data) paths.push({ loc: `/${mode}/${slug}` });
    if (data.length < pageSize) break;
  }

  return paths;
}

export default {
  siteUrl: "https://algotype.net",
  generateRobotsTxt: true,
  outDir: "public",
  // Internal, private or one-off auth pages
  exclude: [
    "/colors",
    "/account",
    "/settings",
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
      return await getChallengePaths();
    } catch (err) {
      // Placeholder env (CI) or Supabase unreachable: keep the static pages
      console.warn("Sitemap: could not list challenges:", err.message);
      return [];
    }
  },
};
