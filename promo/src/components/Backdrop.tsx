import React from "react";
import { AbsoluteFill } from "remotion";
import { hairline, page, role, VIDEO } from "../tokens";
import { Keyboard } from "./Keyboard";

// The homepage's page frame: black canvas with hairline border-x rails
export const Backdrop: React.FC<{ rails?: number; children?: React.ReactNode; color?: string }> = ({
  rails = 1,
  children,
  color = role.canvas,
}) => (
  <AbsoluteFill style={{ background: color }}>
    {rails > 0 && (
      <AbsoluteFill
        style={{
          left: page.railInset,
          right: page.railInset,
          width: "auto",
          borderLeft: `${hairline}px solid ${role.border}`,
          borderRight: `${hairline}px solid ${role.border}`,
          opacity: rails,
        }}
      />
    )}
    {children}
  </AbsoluteFill>
);

// The homepage hero's grid: 20px cells in the border colour, masked so it
// fades out toward the top (mask-image: linear-gradient(to top, #ffffffad, transparent)).
// Like the homepage, it sits inside the page's border-x rails.
export const HeroGrid: React.FC<{ opacity?: number; cell?: number }> = ({ opacity = 1, cell = page.gridCell }) => (
  <AbsoluteFill
    style={{
      left: page.railInset,
      right: page.railInset,
      width: "auto",
      opacity,
      maskImage: "linear-gradient(to top, #ffffffad, transparent)",
      WebkitMaskImage: "linear-gradient(to top, #ffffffad, transparent)",
    }}
  >
    <svg width="100%" height="100%">
      <defs>
        <pattern id="hero-grid" width={cell} height={cell} patternUnits="userSpaceOnUse" x={-1} y={-1}>
          <path d={`M.5 ${cell}V.5H${cell}`} fill="none" stroke={role.border} strokeWidth={hairline} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-grid)" />
    </svg>
  </AbsoluteFill>
);

// The login and signup pages' KeyboardBackground: rows of the site's
// <Keyboard /> (Kbd "keyboard" variant) tiled 720 × 230 site px apart, each
// row drifting 20 px/s, alternate rows the other way. Drawn at the density a
// 1440px-wide browser shows it, inside the page's rails. `t` is seconds.
const KB = { w: 720, h: 230, margin: 16, speed: 20 };
// `clearCentre` masks it away behind a centred title, the way the login
// card covers the middle of the page.
export const KeyboardBackground: React.FC<{ t: number; opacity?: number; clearCentre?: boolean }> = ({
  t,
  opacity = 1,
  clearCentre = false,
}) => {
  const u = VIDEO.width / 1440;
  const mask = clearCentre ? "radial-gradient(ellipse 50% 32% at 50% 50%, transparent 45%, black 100%)" : undefined;
  const rows = Math.ceil(VIDEO.height / (KB.h * u)) + 1;
  const perRow = Math.ceil(VIDEO.width / (KB.w * u)) + 2;
  const total = perRow * KB.w;
  return (
    <AbsoluteFill
      style={{
        left: page.railInset,
        right: page.railInset,
        width: "auto",
        overflow: "hidden",
        opacity,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    >
      {Array.from({ length: rows }).flatMap((_, r) => {
        const direction = r % 2 === 0 ? 1 : -1;
        return Array.from({ length: perRow }).map((_, i) => {
          // site px, wrapped so the row never runs out
          const x = ((((i * KB.w + direction * KB.speed * t) % total) + total) % total) - KB.w;
          return (
            <div
              key={`${r}-${i}`}
              style={{ position: "absolute", left: (x + KB.margin) * u, top: (r * KB.h + KB.margin) * u }}
            >
              <Keyboard unit={u} variant="keyboard" />
            </div>
          );
        });
      })}
    </AbsoluteFill>
  );
};
