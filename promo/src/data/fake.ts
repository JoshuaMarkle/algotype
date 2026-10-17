// Invented account data for the montage (the site has no aggregate stats
// yet). Deterministic: the same frames render the same values every time.
import { random } from "remotion";

const noise = (seed: string, i: number) => random(`${seed}-${i}`) - 0.5;

// ~60 tests climbing from the mid-60s to ~115 with realistic wobble
export const wpmHistory = Array.from({ length: 48 }, (_, i) => {
  const t = i / 47;
  return Math.round(64 + 50 * (1 - Math.exp(-2.6 * t)) + noise("wpm", i) * 12);
});

export const accuracyTrend = Array.from({ length: 36 }, (_, i) =>
  Math.round((91 + 7 * (i / 35) + noise("acc", i) * 3) * 10) / 10,
);

// 20 weeks × 7 days, intensity 0..4, busier toward the present
export const heatmapData = Array.from({ length: 20 }, (_, w) =>
  Array.from({ length: 7 }, (_, d) => {
    const r = random(`heat-${w}-${d}`) + w / 60;
    return r < 0.35 ? 0 : r < 0.6 ? 1 : r < 0.8 ? 2 : r < 0.95 ? 3 : 4;
  }),
);
