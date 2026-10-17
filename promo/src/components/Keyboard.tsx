import React from "react";
import { color, font, hairline, radius, role, weight } from "../tokens";

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
export const ROW_WIDTH = 712; // every row adds up to this
const KEY_H = 38; // py-2 + text-sm line + border
const GAP = 8;
export const keyboardHeight = (unit: number) => (5 * KEY_H + 4 * GAP) * unit;

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

// `badge` is a count in an error-red circle on the key's top-right corner
export type KeyPaint = { fill?: string; border?: string; text?: string; badge?: string; badgeOpacity?: number };

// Kbd variants: "default" (bg-2, border, fg-3 here so it reads at video
// size) and "keyboard" (text-fg-4, border-border-subtle, no fill), the one
// KeyboardBackground tiles behind the login and signup pages
const VARIANTS = {
  default: { fill: role.surface, border: role.border, text: color.fg3 },
  keyboard: { fill: "transparent", border: role.borderSubtle, text: color.fg4 },
} as const;

export const Keyboard: React.FC<{
  unit: number;
  paint?: (label: string) => KeyPaint | undefined;
  fontSize?: number;
  badgeScale?: number;
  variant?: keyof typeof VARIANTS;
}> = ({ unit, paint, fontSize = 14, badgeScale = 1, variant = "default" }) => (
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
                  background: p.fill ?? VARIANTS[variant].fill,
                  border: `${Math.max(1, hairline * (unit / 2))}px solid ${p.border ?? VARIANTS[variant].border}`,
                  color: p.text ?? VARIANTS[variant].text,
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
                      top: -10 * unit * badgeScale,
                      right: -8 * unit * badgeScale,
                      minWidth: 18 * unit * badgeScale,
                      height: 18 * unit * badgeScale,
                      padding: `0 ${4 * unit * badgeScale}px`,
                      boxSizing: "border-box",
                      borderRadius: 9 * unit * badgeScale,
                      background: role.error,
                      color: role.text,
                      fontSize: 11 * unit * badgeScale,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: p.badgeOpacity ?? 1,
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
