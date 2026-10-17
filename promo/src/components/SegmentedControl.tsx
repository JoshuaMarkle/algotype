import React from "react";
import { font, hairline, radius, role, space, text, weight } from "../tokens";
import { mix } from "../time";

// Tabs in the site's style: bg-2 track with a hairline border, the active
// segment is the page background with its own hairline. `active` may be
// fractional while switching; the indicator slides between segments.
export const SegmentedControl: React.FC<{
  options: readonly string[];
  active: number;
  segmentWidth?: number;
  size?: number;
}> = ({ options, active, segmentWidth = 200, size = text.sm }) => {
  const pad = space(1);
  const h = size * 2.6;
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        padding: pad,
        background: role.surface,
        border: `${hairline}px solid ${role.border}`,
        borderRadius: radius.lg,
        fontFamily: font.sans,
        fontWeight: weight.medium,
        fontSize: size,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: pad,
          left: pad + active * segmentWidth,
          width: segmentWidth,
          height: h,
          boxSizing: "border-box",
          background: role.canvas,
          border: `${hairline}px solid ${role.border}`,
          borderRadius: radius.md,
        }}
      />
      {options.map((o, i) => {
        const on = Math.max(0, 1 - Math.abs(active - i));
        return (
          <div
            key={o}
            style={{
              position: "relative",
              width: segmentWidth,
              height: h,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: on > 0.5 ? role.text : role.textMuted,
              opacity: mix(0.85, 1, on),
            }}
          >
            {o}
          </div>
        );
      })}
    </div>
  );
};
