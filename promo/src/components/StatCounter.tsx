import React from "react";
import { font, role, space, text, weight } from "../tokens";
import { fadeUp } from "../time";

// One results number as TypingResults draws it: text-6xl light mono, then a
// text-lg mono label with green / red dot details
export const StatCounter: React.FC<{
  value: number;
  suffix?: string;
  label: string;
  dots?: [number, number];
  t: number;
  valueColor?: string;
  badge?: React.ReactNode;
}> = ({ value, suffix = "", label, dots, t, valueColor = role.text, badge }) => (
  <div style={{ position: "relative", fontFamily: font.mono, ...fadeUp(Math.min(1, t * 3), 24) }}>
    <div
      style={{
        fontSize: text["6xl"],
        fontWeight: weight.light,
        lineHeight: 1,
        color: valueColor,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {Math.round(value * t)}
      {suffix}
    </div>
    <div style={{ fontSize: text.lg, marginTop: space(2), color: role.text, whiteSpace: "nowrap" }}>
      {label}
      {dots && (
        <>
          {" "}
          <span style={{ color: role.correct }}>•</span>
          {Math.round(dots[0] * t)} <span style={{ color: role.error }}>•</span>
          {Math.round(dots[1] * t)}
        </>
      )}
    </div>
    {badge}
  </div>
);
