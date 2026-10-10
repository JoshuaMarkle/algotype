import { describe, it, expect } from "vitest";

import {
  DEFAULT_SETTINGS,
  mergeSettings,
  sanitizeSettings,
} from "@/lib/settings";

describe("sanitizeSettings", () => {
  it("keeps known keys with the right type and a numeric updated_at", () => {
    expect(
      sanitizeSettings({
        theme: "nord",
        line_numbers: "yes",
        syntax_highlighting: false,
        extra: 1,
        updated_at: 5,
      }),
    ).toEqual({ theme: "nord", syntax_highlighting: false, updated_at: 5 });
  });

  it("returns an empty object for non-objects", () => {
    expect(sanitizeSettings(null)).toEqual({});
    expect(sanitizeSettings("x")).toEqual({});
  });
});

describe("mergeSettings", () => {
  it("pulls the account copy when it is newer", () => {
    const { action, settings } = mergeSettings(
      { theme: "nord", updated_at: 1 },
      { theme: "dracula", updated_at: 2 },
    );
    expect(action).toBe("pull");
    expect(settings).toEqual({
      ...DEFAULT_SETTINGS,
      theme: "dracula",
      updated_at: 2,
    });
  });

  it("pushes local settings when they are newer or the account is empty", () => {
    expect(mergeSettings({ theme: "nord", updated_at: 3 }, {}).action).toBe(
      "push",
    );
    expect(
      mergeSettings({ updated_at: 3 }, { theme: "x", updated_at: 2 }).action,
    ).toBe("push");
  });

  it("does nothing when neither copy was changed or both match", () => {
    expect(mergeSettings({ ...DEFAULT_SETTINGS }, {}).action).toBe("none");
    expect(mergeSettings({ updated_at: 4 }, { updated_at: 4 }).action).toBe(
      "none",
    );
  });
});
