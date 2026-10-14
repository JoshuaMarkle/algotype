import { describe, expect, it } from "vitest";

import {
  challengeDescription,
  challengePath,
  challengeTitle,
  decodeSlug,
  pageMetadata,
} from "@/lib/seo";

describe("pageMetadata", () => {
  it("points canonical and og:url at the page", () => {
    const meta = pageMetadata({
      title: "Files | AlgoType",
      description: "d",
      path: "/files",
    });
    expect(meta.alternates.canonical).toBe("https://algotype.net/files");
    expect(meta.openGraph.url).toBe("https://algotype.net/files");
    expect(meta.openGraph.title).toBe("Files | AlgoType");
    expect(meta.twitter.title).toBe("Files | AlgoType");
    expect(meta.robots).toBeUndefined();
  });

  it("uses the bare domain for the home page", () => {
    expect(
      pageMetadata({ title: "t", description: "d", path: "/" }).alternates
        .canonical,
    ).toBe("https://algotype.net");
  });

  it("marks noindex pages but keeps links followed", () => {
    const meta = pageMetadata({
      title: "t",
      description: "d",
      path: "/login",
      noindex: true,
    });
    expect(meta.robots).toEqual({ index: false, follow: true });
  });
});

describe("challengeTitle", () => {
  it("keeps the full title when it fits", () => {
    expect(challengeTitle("Two Sum", "Python")).toBe(
      "Two Sum (Python) Typing Practice | AlgoType",
    );
  });

  it("drops words to stay within 60 characters", () => {
    const mid = challengeTitle("Count Number of Possible Root Nodes", "C++");
    expect(mid).toBe("Count Number of Possible Root Nodes (C++) | AlgoType");
    const long = "Minimum Number of Operations to Make Array Continuous Again";
    expect(challengeTitle(long, "JavaScript")).toBe(`${long} (JavaScript)`);
  });
});

describe("challengeDescription", () => {
  it("stays under 160 characters for a long problem name", () => {
    const text = challengeDescription(
      "Minimum Number of Operations to Make Array Continuous",
      "JavaScript",
      "LeetCode solution",
      120,
    );
    expect(text.length).toBeLessThanOrEqual(160);
  });
});

describe("challengePath", () => {
  it("encodes slugs that would break a URL", () => {
    expect(challengePath("algorithms", "IsGraphBipartite?-cpp")).toBe(
      "/algorithms/IsGraphBipartite%3F-cpp",
    );
    expect(challengePath("algorithms", "TwoSum-python")).toBe(
      "/algorithms/TwoSum-python",
    );
  });
});

describe("decodeSlug", () => {
  it("decodes an encoded slug and round-trips challengePath", () => {
    for (const slug of [
      "IsGraphBipartite?-cpp",
      "ElementAppearingMoreThan25%InSortedArray-javascript",
      "Pow(x,n)-java",
      "NumberofWaystoPaintN×3Grid-java",
    ]) {
      const encoded = challengePath("algorithms", slug).split("/").at(-1);
      expect(decodeSlug(encoded)).toBe(slug);
    }
  });

  it("keeps an already decoded slug with a bare %", () => {
    expect(decodeSlug("ElementAppearingMoreThan25%InSortedArray-js")).toBe(
      "ElementAppearingMoreThan25%InSortedArray-js",
    );
  });
});
