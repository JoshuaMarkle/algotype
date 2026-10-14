import { describe, expect, it, vi } from "vitest";

import {
  drillPaths,
  languageHubPaths,
  listChallenges,
  sitemapEntries,
  timedPaths,
} from "@/lib/sitemap";

// Fake Supabase query builder serving `rows` through .range(from, to)
function fakeSupabase(rows, error = null) {
  const range = vi.fn(async (from, to) =>
    error ? { data: null, error } : { data: rows.slice(from, to + 1), error },
  );
  const builder = { select: () => builder, order: () => builder, range };
  return { from: () => builder, range };
}

describe("listChallenges", () => {
  it("pages past the 1000-row response cap", async () => {
    const rows = Array.from({ length: 2500 }, (_, i) => ({
      mode: "algorithms",
      slug: `P${i}-cpp`,
    }));
    const supabase = fakeSupabase(rows);
    expect(await listChallenges(supabase)).toEqual(rows);
    expect(supabase.range).toHaveBeenCalledTimes(3);
  });

  it("throws on a query error so a partial sitemap is never served", async () => {
    await expect(
      listChallenges(fakeSupabase([], { message: "boom" })),
    ).rejects.toThrow("boom");
  });
});

describe("languageHubPaths", () => {
  it("lists each mode + language once", () => {
    expect(
      languageHubPaths([
        { mode: "algorithms", language: "cpp" },
        { mode: "algorithms", language: "cpp" },
        { mode: "algorithms", language: "rust" },
        { mode: "algorithms", language: "cobol" },
      ]),
    ).toEqual(["/algorithms/language/cpp", "/algorithms/language/rust"]);
  });
});

describe("sitemapEntries", () => {
  const urls = sitemapEntries([
    { mode: "algorithms", slug: "IsGraphBipartite?-cpp", language: "cpp" },
    { mode: "algorithms", slug: "TwoSum-cpp", language: "cpp" },
    { mode: "files", slug: "cube", language: "python" },
  ]).map((e) => e.url);

  it("lists the home page, mode pages, drills, timed tests and challenges", () => {
    expect(urls).toContain("https://algotype.net");
    expect(urls).toContain("https://algotype.net/algorithms");
    expect(urls).toContain("https://algotype.net/drills/python-for");
    expect(urls).toContain("https://algotype.net/timed/java-60");
    expect(urls).toContain(
      "https://algotype.net/algorithms/IsGraphBipartite%3F-cpp",
    );
    expect(urls).toContain("https://algotype.net/files/cube");
    expect(urls).toContain("https://algotype.net/algorithms/language/cpp");
    expect(urls).toContain("https://algotype.net/files/language/python");
    // 8 static pages, 3 challenges, 2 language hubs
    expect(urls).toHaveLength(
      8 + drillPaths().length + timedPaths().length + 3 + 2,
    );
  });

  it("leaves out redirects, private and noindex pages", () => {
    for (const path of [
      "/timed",
      "/colors",
      "/account",
      "/settings",
      "/login",
    ]) {
      expect(urls).not.toContain(`https://algotype.net${path}`);
    }
  });

  it("has no duplicate URLs", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("only lists drill and timed slugs the pages accept", async () => {
    const { parseDrillSlug } = await import("@/lib/drills");
    const { parseTimedSlug } = await import("@/lib/timed");
    expect(drillPaths()).toHaveLength(18);
    expect(timedPaths()).toHaveLength(9);
    for (const p of drillPaths())
      expect(parseDrillSlug(p.split("/")[2])).not.toBeNull();
    for (const p of timedPaths())
      expect(parseTimedSlug(p.split("/")[2])).not.toBeNull();
  });
});
