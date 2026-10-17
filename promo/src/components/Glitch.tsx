import React from "react";
import { random } from "remotion";

// The character set of the site's LetterGlitch effect
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>,0123456789";

// Scramble a string: each character swaps for a glyph with chance `amount`,
// re-rolled every frame
export const scramble = (s: string, amount: number, frame: number) =>
  s
    .split("")
    .map((ch, i) =>
      random(`scr-${frame}-${i}`) < amount ? GLYPHS[Math.floor(random(`g-${frame}-${i}`) * GLYPHS.length)] : ch,
    )
    .join("");

// A short digital glitch over `children`: horizontal slices tear sideways,
// an accent copy splits off, slices drop out, and the last frames collapse
// to a hairline. `t` runs 0 → 1 across the glitch; at 1 nothing is left.
// `render(split)` draws the content; split = true is the accent copy.
export const Glitch: React.FC<{ t: number; frame: number; render: (split: boolean) => React.ReactNode; slices?: number }> = ({
  t,
  frame,
  render,
  slices = 9,
}) => {
  const children = render(false);
  if (t >= 1) return <div style={{ visibility: "hidden" }}>{children}</div>;
  if (t <= 0) return <>{children}</>;
  const amp = 160 * Math.sin(Math.PI * Math.min(1, t * 1.15));
  const collapse = t > 0.78 ? (t - 0.78) / 0.22 : 0; // squash to a line
  const drop = Math.max(0, t - 0.35) * 1.3; // share of slices gone
  return (
    <div style={{ position: "relative" }}>
      <div style={{ visibility: "hidden" }}>{children}</div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scaleY(${1 - collapse * 0.97})`,
        }}
      >
        {Array.from({ length: slices }, (_, i) => {
          const r = random(`gl-${frame}-${i}`);
          if (random(`gd-${frame}-${i}`) < drop) return null;
          const dx = (r - 0.5) * 2 * amp * (random(`gk-${frame}-${i}`) < 0.6 ? 1 : 0.15);
          const top = (i / slices) * 100;
          const bottom = 100 - ((i + 1) / slices) * 100;
          return (
            <React.Fragment key={i}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: `inset(${top}% 0 ${bottom}% 0)`,
                  transform: `translateX(${dx + amp * 0.18}px)`,
                  opacity: 0.9,
                }}
              >
                {render(true)}
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  clipPath: `inset(${top}% 0 ${bottom}% 0)`,
                  transform: `translateX(${dx}px)`,
                }}
              >
                {children}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
