import React from "react";
import { AbsoluteFill } from "remotion";
import { hairline, page, role } from "../tokens";

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
// fades out toward the top (mask-image: linear-gradient(to top, #ffffffad, transparent))
export const HeroGrid: React.FC<{ opacity?: number; cell?: number }> = ({ opacity = 1, cell = page.gridCell }) => (
  <AbsoluteFill
    style={{
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
