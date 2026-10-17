// The site's design tokens as code. Every value here comes from
// src/app/globals.css (default theme) and the site's components, scaled up
// for a 1920×1080 frame. Scenes and components use only these values.
//
// docs/DESIGN.md does not exist yet, and BRAND.md has no colour or logo
// rules, so the source of truth is the live site's styles.

import { Easing } from "remotion";

export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

// Site px → video px. The site is designed around a ~1440px browser; at
// 1920 wide a factor of 2 keeps UI legible on a phone-sized replay too.
export const SCALE = 2;
const px = (sitePx: number) => sitePx * SCALE;

// --- Colour (globals.css, :root / [data-theme="default"]) ---
export const color = {
  bg: "#040404",
  bg2: "#0f1012",
  bg3: "#16181b",
  bg4: "#2d3035",
  bg5: "#434750",
  fg: "#f4f5f6",
  fg2: "#8a8a90",
  fg3: "#5a5a5f",
  fg4: "#2d3035",
  red: "#da3633",
  green: "#00c756",
  blue: "#0096f5",
  blue2: "#4971fc",
  blue3: "#315efc",
  yellow: "#ffb347",
  white: "#ffffff",
} as const;

// Roles. The accent is the brand's single "look here" colour (--color-primary).
export const role = {
  canvas: color.bg,
  surface: color.bg2, // cards (--color-card)
  surfaceMuted: color.bg3, // muted / secondary (--color-muted)
  border: color.bg4, // --color-border
  borderSubtle: color.bg3, // --color-border-subtle
  text: color.fg,
  textMuted: color.fg2, // --color-muted-foreground
  textFaint: color.fg3,
  accent: color.blue, // --color-primary, the one thing to look at
  correct: color.green,
  error: color.red,
  warning: color.yellow,
  cursor: color.bg5, // .cursor background
} as const;

// Syntax colours (--syntax-*), used by the editor exactly like .token-* classes
export const syntax = {
  comment: "#5a5a5f",
  punctuation: "#c9d1d9",
  number: "#79c0ff",
  keyword: "#ff7b72",
  string: "#a5d6ff",
  function: "#d2a8ff",
  tag: "#7ee787",
  operator: "#ffab70",
  variable: "#ffa657",
  plain: color.fg,
  untyped: color.fg2, // .token default: text not typed yet
  disabled: color.fg3,
} as const;

// --- Type (Geist + Geist Mono, the site's fonts) ---
export const font = {
  sans: "Geist",
  mono: "Geist Mono",
} as const;

export const weight = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// Tailwind sizes the site uses, scaled. `title` is a page heading at video
// scale; `display` is the results numbers (text-6xl).
export const text = {
  xs: px(12),
  sm: px(14),
  base: px(16),
  lg: px(18),
  xl: px(20),
  "2xl": px(24),
  "5xl": px(48),
  "6xl": px(60),
  code: 32, // text-sm code, a little larger so it reads at video size
  title: 104,
  subtitle: px(20),
  wordmark: 120,
} as const;

export const leading = {
  tight: 1.1,
  snug: 1.25,
  relaxed: 1.625, // code: leading-relaxed
} as const;

export const tracking = {
  title: "-0.035em",
  normal: "0em",
} as const;

// --- Space (Tailwind's 4px grid, scaled) ---
export const space = (n: number) => px(4 * n);

export const layout = {
  margin: 160, // safe outer margin of the frame
  contentWidth: px(1024 - 64), // max-w-5xl minus padding, like the test page
} as const;

// --- Radii (--radius: 0.625rem and its steps) ---
export const radius = {
  sm: px(6),
  md: px(8),
  lg: px(10),
  xl: px(14),
  full: 9999,
} as const;

// Hairline borders: the site's 1px border, scaled
export const hairline = px(1);

// --- Motion ---
// Calm and precise: ease-out for entrances, ease-in-out for camera moves and
// morphs. No spring, bounce or overshoot anywhere.
export const ease = {
  out: Easing.bezier(0.22, 1, 0.36, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.55, 0, 1, 0.45),
  linear: Easing.linear,
} as const;

// Seconds
export const duration = {
  fast: 0.25,
  base: 0.5, // the site's fade-up
  slow: 0.8,
  camera: 1.0,
  wordStagger: 0.08, // between words of a kinetic headline
  hold: 1.0, // breathing room after every beat
} as const;
