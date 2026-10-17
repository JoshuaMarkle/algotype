// Invented account data for the montage (the site has no aggregate stats
// yet). Deterministic: the same frames render the same values every time.
import { random } from "remotion";

const noise = (seed: string, i: number) => random(`${seed}-${i}`) - 0.5;

// 40 tests climbing from the mid-60s; the latest one is the record (121)
export const wpmHistory = Array.from({ length: 40 }, (_, i) => {
  if (i === 39) return 121;
  const t = i / 39;
  return Math.min(117, Math.round(64 + 48 * (1 - Math.exp(-2.4 * t)) + noise("wpm", i) * 10));
});

export const rawHistory = wpmHistory.map((v, i) => Math.round(v + 5 + random(`raw-${i}`) * 6));

export const accuracyTrend = Array.from({ length: 30 }, (_, i) =>
  Math.round((90.5 + 7.5 * (1 - Math.exp(-2.5 * (i / 29))) + noise("acc", i) * 2.4) * 10) / 10,
);

// 20 weeks × 7 days, intensity 0..4, busier toward the present
export const heatmapData = Array.from({ length: 20 }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => {
    const r = random(`heat-${w}-${d}`) * 0.85 + w / 45;
    return r < 0.3 ? 0 : r < 0.55 ? 1 : r < 0.78 ? 2 : r < 0.95 ? 3 : 4;
  }),
);

export const bestsByLanguage = [
  { label: "Python", value: 121 },
  { label: "JS", value: 112 },
  { label: "C++", value: 104 },
  { label: "Java", value: 98 },
  { label: "Rust", value: 87 },
];

export const slowestPairs = [
  { label: "->", value: 412 },
  { label: "::", value: 365 },
  { label: "!=", value: 318 },
  { label: "=>", value: 276 },
  { label: "{}", value: 241 },
];

export const slowestKeys = [
  { label: "`", value: 388 },
  { label: "|", value: 352 },
  { label: "\\", value: 330 },
  { label: "{", value: 297 },
  { label: "~", value: 270 },
];

export const minutesPerWeek = ["", "", "", "", "", "", "", "", "", "", "", ""].map((_, i) => ({
  label: `W${i + 1}`,
  value: Math.round(40 + i * 9 + random(`week-${i}`) * 30),
}));

export const testsPerDay = Array.from({ length: 14 }, (_, i) => ({
  label: ["M", "T", "W", "T", "F", "S", "S"][i % 7],
  value: Math.round(3 + random(`day-${i}`) * 9 + (i > 9 ? 3 : 0)),
}));

export const accuracyByLanguage = [
  { label: "Python", value: 98 },
  { label: "Java", value: 97 },
  { label: "C++", value: 96 },
  { label: "JS", value: 95 },
  { label: "Rust", value: 93 },
];

export const averages = { wpm: 104, acc: 97, time: "38:12:07" };

export const recentTests = [
  { wpm: 121, acc: 98, language: "Python", slug: "quicksort", mode: "files" },
  { wpm: 109, acc: 97, language: "C++", slug: "two-sum", mode: "algorithms" },
  { wpm: 114, acc: 99, language: "Python", slug: "4sum", mode: "algorithms" },
  { wpm: 98, acc: 95, language: "Java", slug: "rotting-oranges", mode: "algorithms" },
  { wpm: 106, acc: 97, language: "JS", slug: "debounce", mode: "drills" },
];

// keys that went wrong most often across all tests
export const allTimeKeyErrors: Record<string, number> = {
  "[": 9, "]": 6, "-": 7, "=": 5, ";": 4, "'": 3, P: 3, "9": 2, "0": 2, "\\": 2, "/": 1,
};

// last 28 days, practised or not; the streak is the run at the end
export const streakDays = Array.from({ length: 28 }, (_, i) => (i >= 5 ? true : random(`streak-${i}`) > 0.5));
export const streak = 23;
