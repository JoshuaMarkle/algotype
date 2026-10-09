import { afterEach, describe, expect, it, vi } from "vitest";

import { calculateStats } from "@/components/typing/utils/calculateStats";

const statsRef = (correct, incorrect = 0, backspace = 0) => ({
  current: { correct, incorrect, backspace },
});

describe("calculateStats", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns defaults before the test has started", () => {
    expect(calculateStats(null, 1000, statsRef(10))).toEqual({
      wpm: 0,
      acc: 100,
      time: 0,
      timeTillWpmDrop: Infinity,
    });
  });

  it("returns defaults when the stats ref is missing", () => {
    expect(calculateStats(1000, 2000, undefined).wpm).toBe(0);
    expect(calculateStats(1000, 2000, {}).acc).toBe(100);
  });

  it("counts 5 correct keystrokes as one word", () => {
    // 50 correct keys in 60 s = 10 words per minute
    const { wpm, acc, time } = calculateStats(0.001, 60_000.001, statsRef(50));
    expect(wpm).toBe(10);
    expect(acc).toBe(100);
    expect(time).toBe(60);
  });

  it("rounds WPM and time to the nearest integer", () => {
    // 52 correct in 30.4 s = 20.526 WPM
    const result = calculateStats(1000, 31_400, statsRef(52));
    expect(result.wpm).toBe(21);
    expect(result.time).toBe(30);
  });

  it("ignores incorrect keystrokes for WPM", () => {
    const clean = calculateStats(1000, 61_000, statsRef(100));
    const noisy = calculateStats(1000, 61_000, statsRef(100, 40));
    expect(noisy.wpm).toBe(clean.wpm);
  });

  it("floors accuracy", () => {
    // 2 / 3 = 66.67%
    expect(calculateStats(1000, 2000, statsRef(2, 1)).acc).toBe(66);
    // 199 / 200 = 99.5%
    expect(calculateStats(1000, 2000, statsRef(199, 1)).acc).toBe(99);
  });

  it("reports 100% accuracy when nothing has been typed", () => {
    expect(calculateStats(1000, 2000, statsRef(0, 0)).acc).toBe(100);
  });

  it("does not count backspaces toward accuracy", () => {
    expect(calculateStats(1000, 2000, statsRef(10, 0, 25)).acc).toBe(100);
  });

  it("uses performance.now() when the test is still running", () => {
    vi.spyOn(performance, "now").mockReturnValue(61_000);
    const { wpm, time } = calculateStats(1000, undefined, statsRef(50));
    expect(wpm).toBe(10);
    expect(time).toBe(60);
  });

  it("estimates seconds until WPM drops by one", () => {
    // 50 correct in 60 s = 10 WPM. Reaching 9 WPM with 10 words takes 66.67 s
    const { timeTillWpmDrop } = calculateStats(1000, 61_000, statsRef(50));
    expect(timeTillWpmDrop).toBeCloseTo(60 * (10 / 9) - 60, 5);
  });

  it("reports no WPM drop at or below 1 WPM", () => {
    const { timeTillWpmDrop } = calculateStats(1000, 61_000, statsRef(5));
    expect(timeTillWpmDrop).toBe(Infinity);
  });
});
