import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/supabaseClient", () => ({ supabase: {} }));

import { addResultToCache, isCacheCurrent } from "@/lib/history";

const cache = {
  userId: "u1",
  version: 4,
  total: 2,
  history: [{ id: "b" }, { id: "a" }],
  ts: 1000,
};

describe("isCacheCurrent", () => {
  it("matches on data_version", () => {
    expect(isCacheCurrent(cache, { version: 4, now: 1e12 })).toBe(true);
    expect(isCacheCurrent(cache, { version: 5, now: 1000 })).toBe(false);
  });

  it("falls back to a 60 s window when the version is unknown", () => {
    expect(isCacheCurrent(cache, { version: null, now: 30_000 })).toBe(true);
    expect(isCacheCurrent(cache, { version: null, now: 70_000 })).toBe(false);
  });

  it("rejects a missing cache", () => {
    expect(isCacheCurrent(null, { version: 1, now: 0 })).toBe(false);
  });
});

describe("addResultToCache", () => {
  it("prepends the row and bumps version and total", () => {
    expect(addResultToCache(cache, { id: "c" })).toEqual({
      ...cache,
      version: 5,
      total: 3,
      history: [{ id: "c" }, { id: "b" }, { id: "a" }],
    });
  });

  it("caps the cached rows at the limit", () => {
    expect(addResultToCache(cache, { id: "c" }, 2).history).toEqual([
      { id: "c" },
      { id: "b" },
    ]);
  });

  it("keeps an unknown version unknown and ignores a missing cache", () => {
    expect(addResultToCache({ ...cache, version: null }, {}).version).toBe(
      null,
    );
    expect(addResultToCache(null, {})).toBe(null);
  });
});
