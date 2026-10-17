import React from "react";
import { color, font, hairline, radius, role, weight } from "../tokens";
import { mixColor } from "../time";

// The site's <Keyboard /> (src/components/ui/Kbd.jsx): the same rows and key
// widths, drawn with the Kbd "default" variant (bg-2, border, rounded-sm)
// so it reads at video size. `unit` is site px → video px.
export const ROWS = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
  ["Ctrl", "Win", "Alt", "Space", "Alt", "Fn", "Menu", "Ctrl"],
] as const;

// Tailwind widths from getKeySize (w-10 = 40px)
const WIDE: Record<string, number> = {
  Backspace: 88,
  Tab: 64,
  Caps: 80,
  Enter: 96,
  Shift: 112,
  Ctrl: 64,
  Alt: 56,
  Win: 56,
  Fn: 48,
  Menu: 56,
  "\\": 64,
};
const ROW_WIDTH = 712; // every row adds up to this
const KEY_H = 38; // py-2 + text-sm line + border
const GAP = 8;

const SHIFTED: Record<string, string> = {
  "!": "1", "@": "2", "#": "3", $: "4", "%": "5", "^": "6", "&": "7", "*": "8",
  "(": "9", ")": "0", _: "-", "+": "=", "{": "[", "}": "]", "|": "\\", ":": ";",
  '"': "'", "<": ",", ">": ".", "?": "/", "~": "`",
};

// The key labels a typed character presses
export const keysFor = (ch: string): string[] => {
  if (ch === "Backspace") return ["Backspace"];
  if (ch === "\n") return ["Enter"];
  if (ch === " ") return ["Space"];
  if (SHIFTED[ch]) return [SHIFTED[ch], "Shift"];
  if (/[A-Z]/.test(ch)) return [ch, "Shift"];
  return [ch.toUpperCase()];
};

export type KeyPaint = { fill?: string; border?: string; text?: string; badge?: string };

export const Keyboard: React.FC<{
  unit: number;
  paint?: (label: string) => KeyPaint | undefined;
  fontSize?: number;
}> = ({ unit, paint, fontSize = 14 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: GAP * unit, width: ROW_WIDTH * unit }}>
    {ROWS.map((row, r) => {
      const fixed = row.reduce<number>((s, k) => s + (k === "Space" ? 0 : WIDE[k] ?? 40), 0);
      const space = ROW_WIDTH - fixed - GAP * (row.length - 1);
      return (
        <div key={r} style={{ display: "flex", gap: GAP * unit }}>
          {row.map((k, i) => {
            const p = paint?.(k) ?? {};
            const w = k === "Space" ? space : WIDE[k] ?? 40;
            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  width: w * unit,
                  height: KEY_H * unit,
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: radius.sm * (unit / 2),
                  background: p.fill ?? role.surface,
                  border: `${Math.max(1, hairline * (unit / 2))}px solid ${p.border ?? role.border}`,
                  color: p.text ?? color.fg3,
                  fontFamily: font.mono,
                  fontWeight: weight.medium,
                  fontSize: fontSize * unit,
                }}
              >
                {k === "Space" ? "" : k}
                {p.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: -10 * unit,
                      right: -8 * unit,
                      minWidth: 18 * unit,
                      height: 18 * unit,
                      padding: `0 ${4 * unit}px`,
                      boxSizing: "border-box",
                      borderRadius: 9 * unit,
                      background: role.error,
                      color: role.text,
                      fontSize: 11 * unit,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {p.badge}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      );
    })}
  </div>
);

// A single keycap (Kbd "default" variant: bg-2, border, rounded-sm, mono),
// sized for the frame. `tint` 0 → 1 colours it with the error colour.
export const Kbd: React.FC<{ label: string; size?: number; tint?: number; tintColor?: string }> = ({
  label,
  size = 84,
  tint = 0,
  tintColor = role.error,
}) => (
  <div
    style={{
      minWidth: size,
      height: size,
      padding: `0 ${size * 0.2}px`,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: radius.sm,
      background: mixColor(role.surfaceMuted, tintColor, tint * 0.35),
      border: `${hairline}px solid ${mixColor(role.border, tintColor, tint)}`,
      color: role.text,
      fontFamily: font.mono,
      fontWeight: weight.medium,
      fontSize: size * 0.42,
    }}
  >
    {label}
  </div>
);
