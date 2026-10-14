import { describe, expect, it } from "vitest";

import { pageMetadata } from "@/lib/seo";

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
