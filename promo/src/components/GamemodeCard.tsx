import React from "react";
import { ArrowRight } from "lucide-react";
import { font, hairline, radius, role, space, text } from "../tokens";

// The homepage's gamemode card: bg-2, hairline border, rounded-sm, p-6, h-48;
// a text-xl title over its fg-2 description, and an ArrowRight (size-4) in
// the bottom-right corner. Only the contents: the scene draws the card's
// surface, so it can grow into the editor window.
export const GamemodeCardContent: React.FC<{ title: string; description: string }> = ({ title, description }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      padding: space(6),
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      fontFamily: font.sans,
    }}
  >
    <div style={{ display: "flex", flexDirection: "column", gap: space(2) }}>
      <div style={{ fontSize: text.xl, color: role.text }}>{title}</div>
      <div style={{ fontSize: text.base, lineHeight: 1.5, color: role.textMuted }}>{description}</div>
    </div>
    <ArrowRight size={space(4)} strokeWidth={2} color={role.text} style={{ marginLeft: "auto" }} />
  </div>
);

export const cardSurface = (borderColor: string = role.border): React.CSSProperties => ({
  boxSizing: "border-box",
  background: role.surface,
  border: `${hairline}px solid ${borderColor}`,
  borderRadius: radius.sm,
});
