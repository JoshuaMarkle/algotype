import React from "react";
import { AbsoluteFill } from "remotion";
import { space } from "../tokens";
import { KineticHeadline, Subtitle } from "./KineticHeadline";

// A scene's opening: big kinetic title, muted subtitle under it, centred.
// It comes in before anything else, holds, then leaves for the content.
export const SectionTitle: React.FC<{
  title: string;
  subtitle?: string;
  start: number;
  exit?: readonly [number, number];
}> = ({ title, subtitle, start, exit }) => (
  <AbsoluteFill
    style={{
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: space(6),
    }}
  >
    <KineticHeadline text={title} start={start} exit={exit} />
    {subtitle && (
      <Subtitle text={subtitle} start={start + 0.45} exit={exit} />
    )}
  </AbsoluteFill>
);
