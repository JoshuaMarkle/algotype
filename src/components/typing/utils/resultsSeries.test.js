import { describe, expect, it } from "vitest";

import { buildResultsSeries } from "@/components/typing/utils/resultsSeries";

const sample = (wpm, time) => ({ wpm, acc: 100, time });

describe("buildResultsSeries", () => {
  it("never mutates the collected samples", () => {
    const samples = [sample(40, 1), sample(50, 2)];
    buildResultsSeries(samples, sample(60, 3), null);
    buildResultsSeries(samples, sample(60, 3), 3000);
    expect(samples).toEqual([sample(40, 1), sample(50, 2)]);
  });

  it("does not append the live result while the test is running", () => {
    const series = buildResultsSeries([sample(40, 1)], sample(55, 1.5), null);
    expect(series).toEqual([sample(40, 1)]);
  });

  it("appends the final result once the test has ended", () => {
    const series = buildResultsSeries([sample(40, 1)], sample(55, 2), 2000);
    expect(series).toEqual([sample(40, 1), sample(55, 2)]);
  });

  it("skips the final result when it matches the last sample", () => {
    const series = buildResultsSeries([sample(40, 1)], sample(40, 1), 1000);
    expect(series).toHaveLength(1);
  });

  it("returns an empty series for tests under one second", () => {
    expect(buildResultsSeries([], sample(80, 0), 500)).toEqual([]);
  });

  it("thins long series to at most 25 points", () => {
    const samples = Array.from({ length: 100 }, (_, i) => sample(i, i));
    expect(buildResultsSeries(samples, sample(100, 100), 1).length).toBe(25);
  });
});
