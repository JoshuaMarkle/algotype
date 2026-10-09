import { cleanData } from "@/lib/utils";

// Build the WPM-over-time series for the results graph without mutating the
// samples collected during the test. The final result is appended once the
// test has ended, then the series is thinned for the chart.
export function buildResultsSeries(samples, final, ended) {
  const series = [...samples];

  if (
    ended &&
    series.length > 0 &&
    series[series.length - 1].wpm !== final.wpm
  ) {
    series.push(final);
  }

  return cleanData(series);
}
