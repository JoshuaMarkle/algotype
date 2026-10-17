import React from "react";
import { useCurrentFrame } from "remotion";
import { duration, ease, role, text, weight } from "../tokens";
import { progress } from "../time";
import { KineticHeadline } from "./KineticHeadline";
import { LogoMark } from "./Logo";

// The logo mark and name rising out of their masks, the name's weight
// settling from light to the navbar's semibold
export const KineticWordmark: React.FC<{
  start: number;
  name: string;
  size?: number;
  color?: string;
  markColor?: string;
}> = ({ start, name, size = text.wordmark * 1.25, color = role.text, markColor = role.accent }) => {
  const frame = useCurrentFrame();
  const mark = progress(frame, start - 0.1, duration.slow, ease.out);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.28 }}>
      <div style={{ overflow: "hidden", padding: "0.1em 0", margin: "-0.1em 0", fontSize: size }}>
        <div style={{ transform: `translateY(${(1 - mark) * 110}%)`, display: "flex" }}>
          <LogoMark size={size * 1.02} color={markColor} />
        </div>
      </div>
      <KineticHeadline text={name} start={start} size={size} color={color} toWeight={weight.semibold} />
    </div>
  );
};
