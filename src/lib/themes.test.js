import fs from "fs";
import path from "path";
import { describe, it, expect } from "vitest";

import {
  THEMES,
  DEFAULT_THEME,
  isThemeId,
  resolveTheme,
  themeInitScript,
} from "@/lib/themes";

const css = fs.readFileSync(
  path.resolve(__dirname, "../app/globals.css"),
  "utf8",
);

// Run the inline script against a fake localStorage and <html>
function runInitScript(stored) {
  const html = { dataset: {} };
  const localStorage = { getItem: () => stored };
  new Function(
    "localStorage",
    "document",
    themeInitScript("algotype_settings"),
  )(localStorage, { documentElement: html });
  return html.dataset.theme;
}

describe("themes", () => {
  it("has unique ids and includes the default", () => {
    const ids = THEMES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain(DEFAULT_THEME);
  });

  it("has a CSS block for every theme", () => {
    for (const { id } of THEMES) {
      expect(css).toContain(`[data-theme="${id}"]`);
    }
  });

  it("resolves unknown ids to the default", () => {
    expect(isThemeId("nord")).toBe(true);
    expect(isThemeId("nope")).toBe(false);
    expect(resolveTheme("nord")).toBe("nord");
    expect(resolveTheme(undefined)).toBe(DEFAULT_THEME);
    expect(resolveTheme("nope")).toBe(DEFAULT_THEME);
  });

  it("init script applies a saved theme", () => {
    expect(runInitScript(JSON.stringify({ theme: "dracula" }))).toBe("dracula");
  });

  it("init script ignores missing, unknown or malformed settings", () => {
    expect(runInitScript(null)).toBeUndefined();
    expect(runInitScript(JSON.stringify({ theme: "nope" }))).toBeUndefined();
    expect(runInitScript("{not json")).toBeUndefined();
  });
});
