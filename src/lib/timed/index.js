// Timed mode: type as much as possible in 15/30/60 seconds. Content comes
// from the syntax drill generator (every drill type mixed), so like drills
// it never touches the `challenges` table
import {
  DRILL_LANGUAGES,
  DRILL_TYPES,
  buildDrillChallenge,
} from "@/lib/drills";

export const TIMED_MODE = "timed";

export const TIMED_LANGUAGES = DRILL_LANGUAGES;

export const TIMED_DURATIONS = [15, 30, 60];

export const DEFAULT_TIMED = Object.freeze({ language: "python", seconds: 30 });

// Snippets generated per second of test. Drill snippets are roughly 60-150
// characters, so this leaves plenty of room even at 200+ WPM
const SNIPPETS_PER_SECOND = 0.5;
const MIN_SNIPPETS = 10;

// --- Slugs ---
// A timed test is addressed as /timed/<language>-<seconds>, e.g.
// /timed/python-30. The slug is also what history stores

export function timedSlug(language, seconds) {
  return `${language}-${seconds}`;
}

// Returns { language, seconds } or null when the slug is not a timed test
export function parseTimedSlug(slug) {
  if (typeof slug !== "string") return null;
  const match = /^([a-z]+)-(\d+)$/.exec(slug);
  if (!match) return null;

  const language = match[1];
  const seconds = Number(match[2]);
  if (!TIMED_LANGUAGES.includes(language)) return null;
  if (!TIMED_DURATIONS.includes(seconds)) return null;
  return { language, seconds };
}

// --- Generation ---

export function timedSnippetCount(seconds) {
  return Math.max(MIN_SNIPPETS, Math.ceil(seconds * SNIPPETS_PER_SECOND));
}

// A timed test in the same shape as a `challenges` row, ready for TypingTest
export function buildTimedChallenge({ language, seconds, rng }) {
  const drill = buildDrillChallenge({
    language,
    types: DRILL_TYPES.map((t) => t.id),
    count: timedSnippetCount(seconds),
    rng,
  });

  return {
    ...drill,
    title: `${seconds} seconds`,
    mode: TIMED_MODE,
    slug: timedSlug(language, seconds),
  };
}
