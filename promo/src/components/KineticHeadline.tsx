import React from "react";
import { useCurrentFrame } from "remotion";
import {
  duration,
  ease,
  font,
  leading,
  role,
  text,
  tracking,
  weight,
} from "../tokens";
import { mix, progress, span } from "../time";

type Props = {
  text: string;
  // seconds, scene-local
  start: number;
  // optional [start, end]: words rise out of the mask the way they came in
  exit?: readonly [number, number];
  size?: number;
  color?: string;
  align?: "left" | "center";
  fromWeight?: number;
  toWeight?: number;
};

// Each word rises out of a mask while its weight goes from light to bold.
export const KineticHeadline: React.FC<Props> = ({
  text: copy,
  start,
  exit,
  size = text.title,
  color = role.text,
  align = "center",
  fromWeight = weight.light,
  toWeight = weight.bold,
}) => {
  const frame = useCurrentFrame();
  const words = copy.split(" ");

  return (
    <div
      style={{
        fontFamily: font.sans,
        fontSize: size,
        lineHeight: leading.tight,
        letterSpacing: tracking.title,
        color,
        textAlign: align,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: align === "center" ? "center" : "flex-start",
        columnGap: "0.24em",
      }}
    >
      {words.map((word, i) => {
        const wordStart = start + i * duration.wordStagger;
        const t = progress(frame, wordStart, duration.slow, ease.out);
        // the weight keeps settling a little after the word has landed
        const w = progress(frame, wordStart, duration.slow * 1.4, ease.out);
        const out = exit
          ? span(
              frame,
              [
                exit[0] + i * duration.wordStagger * 0.5,
                exit[1] + i * duration.wordStagger * 0.5,
              ],
              ease.in,
            )
          : 0;
        const y = (1 - t) * 105 - out * 105;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              // room for descenders inside the mask
              padding: "0.04em 0 0.14em",
              margin: "-0.04em 0 -0.14em",
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${y}%)`,
                fontVariationSettings: `"wght" ${mix(fromWeight, toWeight, w)}`,
                fontWeight: Math.round(mix(fromWeight, toWeight, w)),
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// Short muted line under a headline: fades up, leaves with it
export const Subtitle: React.FC<{
  text: string;
  start: number;
  exit?: readonly [number, number];
  align?: "left" | "center";
}> = ({ text: copy, start, exit, align = "center" }) => {
  const frame = useCurrentFrame();
  const t = progress(frame, start, duration.base, ease.out);
  const out = exit ? span(frame, exit, ease.in) : 0;
  return (
    <div
      style={{
        fontFamily: font.sans,
        fontSize: text.subtitle,
        fontWeight: weight.regular,
        lineHeight: leading.snug,
        color: role.textMuted,
        textAlign: align,
        opacity: t * (1 - out),
        transform: `translateY(${(1 - t) * 24 - out * 24}px)`,
      }}
    >
      {copy}
    </div>
  );
};
