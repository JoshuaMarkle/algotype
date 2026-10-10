import { describe, expect, it } from "vitest";

import {
  DRILL_LANGUAGES,
  DRILL_TYPES,
  buildDrillChallenge,
  drillSlug,
  generateDrillCode,
  parseDrillSlug,
  seededRandom,
} from "@/lib/drills";
import { TEMPLATES } from "@/lib/drills/templates";
import { countTypableLines, tokenizeCode } from "@/lib/tokenizer";

const TYPE_IDS = DRILL_TYPES.map((t) => t.id);

describe("drill slugs", () => {
  it("orders types canonically", () => {
    expect(drillSlug("python", ["func", "for"])).toBe("python-for-func");
  });

  it("round-trips through parseDrillSlug", () => {
    expect(parseDrillSlug("cpp-while-class")).toEqual({
      language: "cpp",
      types: ["while", "class"],
    });
  });

  it.each([
    "",
    "python",
    "rust-for",
    "python-loops",
    "python-for-for",
    undefined,
  ])("rejects %s", (slug) => {
    expect(parseDrillSlug(slug)).toBeNull();
  });
});

describe("generateDrillCode", () => {
  it("is reproducible with a seed", () => {
    const args = { language: "java", types: ["for", "if"], count: 6 };
    const a = generateDrillCode({ ...args, rng: seededRandom(7) });
    const b = generateDrillCode({ ...args, rng: seededRandom(7) });
    expect(a).toBe(b);
  });

  it("joins `count` snippets with blank lines", () => {
    // Idioms have no blank lines inside a snippet
    const code = generateDrillCode({
      language: "python",
      types: ["idiom"],
      count: 4,
      rng: seededRandom(1),
    });
    expect(code.split("\n\n")).toHaveLength(4);
  });

  it("uses every chosen type", () => {
    const types = ["for", "class"];
    const rng = seededRandom(3);
    const code = generateDrillCode({ language: "cpp", types, count: 2, rng });
    expect(code).toMatch(/for \(/);
    expect(code).toMatch(/struct|class/);
  });
});

describe("templates", () => {
  it("cover every language and type", () => {
    for (const language of DRILL_LANGUAGES) {
      for (const type of TYPE_IDS) {
        expect(TEMPLATES[language][type]?.length).toBeGreaterThan(0);
      }
    }
  });

  it("all tokenize into typable lines that end in a newline", () => {
    const rng = seededRandom(42);
    for (const language of DRILL_LANGUAGES) {
      for (const type of TYPE_IDS) {
        for (const template of TEMPLATES[language][type]) {
          const h = {
            int: (min) => min,
            pick: (arr) => arr[Math.floor(rng() * arr.length)],
            distinct: (arr, k) => arr.slice(0, k),
          };
          const code = template(h);
          expect(code).not.toMatch(/undefined|\t/);

          const tokens = tokenizeCode(code, language);
          expect(countTypableLines(tokens)).toBe(
            code.split("\n").filter((l) => l.trim()).length,
          );
        }
      }
    }
  });
});

describe("buildDrillChallenge", () => {
  it("returns a challenge TypingTest can render", () => {
    const challenge = buildDrillChallenge({
      language: "python",
      types: ["for", "func"],
      count: 5,
      rng: seededRandom(11),
    });

    expect(challenge).toMatchObject({
      mode: "drills",
      language: "python",
      slug: "python-for-func",
      title: "For loops, Functions",
    });
    expect(challenge.lines).toBeGreaterThanOrEqual(5);

    // Every line with something to type ends in a newline token, so
    // stitched snippets flow into each other
    for (const line of challenge.tokens) {
      const typable = line.filter((t) => !t.skip && t.type !== "space");
      if (typable.length) expect(typable.at(-1).type).toBe("newline");
    }
  });
});
