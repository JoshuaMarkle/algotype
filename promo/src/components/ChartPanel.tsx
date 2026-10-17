import React from "react";
import { font, hairline, radius, role, space, text, weight } from "../tokens";

// A card (bg-card, hairline border, rounded-xl) whose name sits on its own
// top-left corner, so the name moves with the chart.
export const ChartPanel: React.FC<{
  title: string;
  width: number;
  height: number;
  children: (inner: { width: number; height: number }) => React.ReactNode;
  style?: React.CSSProperties;
}> = ({ title, width, height, children, style }) => {
  const pad = space(6);
  const titleSize = text.base;
  const titleGap = space(4);
  const inner = {
    width: width - pad * 2,
    height: height - pad * 2 - titleSize * 1.2 - titleGap,
  };
  return (
    <div
      style={{
        width,
        height,
        boxSizing: "border-box",
        padding: pad,
        background: role.surface,
        border: `${hairline}px solid ${role.border}`,
        borderRadius: radius.xl,
        display: "flex",
        flexDirection: "column",
        gap: titleGap,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: font.sans,
          fontWeight: weight.medium,
          fontSize: titleSize,
          lineHeight: 1.2,
          color: role.text,
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </div>
      <div style={{ width: inner.width, height: inner.height }}>
        {children(inner)}
      </div>
    </div>
  );
};
