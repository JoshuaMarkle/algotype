import React from "react";
import { font, hairline, radius, role, space, text, weight } from "../tokens";
import { mixColor } from "../time";

// The site's ToggleGroup, outline variant, size lg (settings page):
// joined items, rounded-md ends, border-input, the "on" item bg-3 / fg.
// `active` may be fractional while switching: the "on" fill slides across.
export const ToggleGroup: React.FC<{
  options: readonly string[];
  active: number;
  itemWidth?: number;
}> = ({ options, active, itemWidth = 200 }) => {
  const h = space(10);
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        borderRadius: radius.md,
        border: `${hairline}px solid ${role.border}`,
        overflow: "hidden",
        fontFamily: font.sans,
        fontWeight: weight.medium,
        fontSize: text.sm,
        background: role.canvas,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: active * itemWidth,
          width: itemWidth,
          height: h,
          background: role.surfaceMuted,
        }}
      />
      {options.map((o, i) => {
        const on = Math.max(0, 1 - Math.abs(active - i));
        return (
          <div
            key={o}
            style={{
              position: "relative",
              width: itemWidth,
              height: h,
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderLeft: i > 0 ? `${hairline}px solid ${role.border}` : undefined,
              color: mixColor(role.textMuted, role.text, on),
            }}
          >
            {o}
          </div>
        );
      })}
    </div>
  );
};
