import React from "react";
import { font, radius, role, space, text, weight } from "../tokens";

// The site's Badge (rounded-sm, text-xs medium, px-2 py-0.5). `tone`:
// accent for the record, or a semantic colour for state only.
const tones = {
  accent: { bg: role.accent, fg: role.text },
  muted: { bg: role.surfaceMuted, fg: role.textMuted },
  correct: { bg: "transparent", fg: role.correct },
  error: { bg: "transparent", fg: role.error },
} as const;

export const StatusBadge: React.FC<{
  label: string;
  tone?: keyof typeof tones;
  size?: number;
  style?: React.CSSProperties;
}> = ({ label, tone = "accent", size = text.sm, style }) => {
  const t = tones[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: `${space(0.5)}px ${space(2)}px`,
        borderRadius: radius.sm,
        background: t.bg,
        color: t.fg,
        border: t.bg === "transparent" ? `2px solid ${t.fg}` : "2px solid transparent",
        fontFamily: font.sans,
        fontWeight: weight.medium,
        fontSize: size,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {label}
    </span>
  );
};
