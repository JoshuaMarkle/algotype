import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge class names safely
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format seconds into time string
export function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const paddedMins = hrs > 0 ? String(mins).padStart(2, "0") : mins;
  const paddedSecs = mins > 0 || hrs > 0 ? String(secs).padStart(2, "0") : secs;

  if (hrs > 0) return `${hrs}:${paddedMins}:${paddedSecs}`;
  if (mins > 0) return `${mins}:${paddedSecs}`;
  return `${secs}s`;
}

// Thin out the data to only maxPoints points
export function cleanData(data, maxPoints = 25) {
  const total = data.length;
  if (total <= maxPoints) return data;

  const step = (total - 1) / (maxPoints - 1);
  const result = [];

  for (let i = 0; i < maxPoints; i++) {
    const index = Math.floor(i * step);
    result.push({ ...data[index] }); // keep index from original
  }

  return result;
}

// Smooth data
export function smoothData(data, smoothing = 20) {
  const windowSize = Math.max(2, Math.round(data.length / smoothing));
  const halfWindow = Math.floor(windowSize / 2);
  const smoothed = [];

  for (let i = 0; i < data.length; i++) {
    // Determine the window range around current point
    const start = Math.max(0, i - halfWindow);
    const end = Math.min(data.length, i + halfWindow + 1);

    const slice = data.slice(start, end);
    const avgWpm = slice.reduce((sum, d) => sum + d.wpm, 0) / slice.length;

    smoothed.push({ index: i, wpm: avgWpm });
  }

  return smoothed;
}
