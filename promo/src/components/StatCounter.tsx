import React from "react";
import { font, role, space, text, weight } from "../tokens";

// A results number the way TypingResults shows it: big light mono value,
// mono label under it. `progress` counts the value up from zero.
export const StatCounter: React.FC<{
  value: number;
  label: string;
  progress?: number;
  suffix?: string;
  accent?: boolean;
  size?: number;
  opacity?: number;
}> = ({ value, label, progress = 1, suffix = "", accent = false, size = text["6xl"], opacity = 1 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: space(1), opacity }}>
    <div
      style={{
        fontFamily: font.mono,
        fontWeight: weight.light,
        fontSize: size,
        lineHeight: 1,
        color: accent ? role.accent : role.text,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {Math.round(value * progress)}
      {suffix}
    </div>
    <div
      style={{
        fontFamily: font.mono,
        fontWeight: weight.regular,
        fontSize: text.lg,
        color: role.textMuted,
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </div>
  </div>
);

// The results row: stats spread with the site's gap-32
export const StatRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", gap: space(32), alignItems: "flex-start" }}>{children}</div>
);
