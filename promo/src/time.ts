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
