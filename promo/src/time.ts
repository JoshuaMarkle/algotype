import type React from "react";
import { interpolate } from "remotion";
import { VIDEO, ease } from "./tokens";

type Easer = (t: number) => number;

// Seconds → frames
export const sec = (s: number) => Math.round(s * VIDEO.fps);

// 0 → 1 progress of a beat that runs from `start` for `dur` seconds,
// with a token easing. `frame` is the scene-local frame.
export const progress = (
  frame: number,
  start: number,
  dur: number,
  easing: Easer = ease.out,
) =>
  interpolate(frame, [start * VIDEO.fps, (start + dur) * VIDEO.fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

// Same, from a [start, end] pair
export const span = (
  frame: number,
  [start, end]: readonly [number, number],
  easing: Easer = ease.out,
) => progress(frame, start, end - start, easing);

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// Blend two #rrggbb colours
export const mixColor = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.min(1, Math.max(0, t))));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

// Fade-up entrance used across scenes (the site's fade-up: 2rem, ease-out)
export const fadeUp = (t: number, distance = 64): React.CSSProperties => ({
  opacity: t,
  transform: `translateY(${(1 - t) * distance}px)`,
});
