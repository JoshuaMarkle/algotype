import { describe, expect, it } from "vitest";

import { seededRandom } from "@/lib/drills";
import {
  TIMED_DURATIONS,
  TIMED_LANGUAGES,
  buildTimedChallenge,
  parseTimedSlug,
  timedSlug,
  timedSnippetCount,
} from "@/lib/timed";

describe("timed slugs", () => {
  it("round-trips through parseTimedSlug", () => {
    expect(parseTimedSlug(timedSlug("cpp", 60))).toEqual({
      language: "cpp",
      seconds: 60,
    });
  });

  it.each(["", "python", "python-45", "rust-30", "python-30-x", undefined])(
    "rejects %s",
    (slug) => {
      expect(parseTimedSlug(slug)).toBeNull();
    },
  );
});

describe("buildTimedChallenge", () => {
  it.each(TIMED_LANGUAGES.flatMap((l) => TIMED_DURATIONS.map((s) => [l, s])))(
    "builds a %s %is test",
    (language, seconds) => {
      const challenge = buildTimedChallenge({
        language,
        seconds,
        rng: seededRandom(seconds),
      });

      expect(challenge.mode).toBe("timed");
      expect(challenge.slug).toBe(`${language}-${seconds}`);
      expect(challenge.language).toBe(language);

      // Enough to type for the whole test at 250 WPM (~21 chars/s)
      const chars = challenge.tokens
        .flat()
        .filter((t) => !t.skip)
        .reduce((n, t) => n + (t.content?.length ?? 0), 0);
      expect(chars).toBeGreaterThan(seconds * 21);
    },
  );

  it("scales the amount of code with the duration", () => {
    expect(timedSnippetCount(60)).toBeGreaterThan(timedSnippetCount(15));
  });
});
