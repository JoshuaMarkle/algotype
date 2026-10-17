import React from "react";
import {
  font,
  hairline,
  leading,
  radius,
  role,
  space,
  syntax,
  text,
  weight,
} from "../tokens";
import type { Ch } from "../data/snippet";

const tokenColor = (type: string) =>
  (syntax as Record<string, string>)[type] ??
  (type === "builtin" ? syntax.function : type === "boolean" ? syntax.number : syntax.plain);

const Chevron: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={role.textMuted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

// The test page in a window: breadcrumb bar on top (as on the site), then the
// TypingRenderer look: line numbers, typed text in syntax colours, untyped
// text in fg-2, wrong keys in the error colour with an underline, and the
// current character marked with the accent.
export const CodeEditor: React.FC<{
  lines: Ch[][];
  typed: number; // keystrokes typed correctly
  wrong?: string; // wrong keys pending after `typed`
  breadcrumb: readonly string[];
  width: number;
  fontSize?: number;
  showCursor?: boolean;
  header?: React.ReactNode; // right side of the bar (live stats)
}> = ({ lines, typed, wrong = "", breadcrumb, width, fontSize = text.code, showCursor = true, header }) => {
  const cursorKey = typed + wrong.length;
  const lineOf = (k: number) => lines.findIndex((l) => l.some((c) => c.key === k));
  const currentLine = Math.max(0, lineOf(Math.min(cursorKey, typed)));
  const barPadX = space(6);

  return (
    <div
      style={{
        width,
        background: role.canvas,
        border: `${hairline}px solid ${role.border}`,
        borderRadius: radius.xl,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: `${space(4)}px ${barPadX}px`,
          borderBottom: `${hairline}px solid ${role.border}`,
          fontFamily: font.sans,
          fontWeight: weight.medium,
          fontSize: text.sm,
          color: role.textMuted,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: space(2) }}>
          {breadcrumb.map((b, i) => (
            <React.Fragment key={b}>
              {i > 0 && <Chevron size={text.sm} />}
              <span style={{ color: i === breadcrumb.length - 1 ? role.text : role.textMuted }}>{b}</span>
            </React.Fragment>
          ))}
        </div>
        {header}
      </div>
      <pre
        style={{
          margin: 0,
          padding: `${space(8)}px ${barPadX}px ${space(10)}px`,
          fontFamily: font.mono,
          fontSize,
          lineHeight: leading.relaxed,
          fontVariantLigatures: "none",
          whiteSpace: "pre",
        }}
      >
        {lines.map((line, li) => (
          <div key={li} style={{ display: "flex" }}>
            <div
              style={{
                width: fontSize * 1.6,
                marginRight: fontSize * 1.1,
                textAlign: "right",
                color: li === currentLine ? role.textMuted : role.textFaint,
              }}
            >
              {li + 1}
            </div>
            <div>
              {line.map((c, ci) => {
                const k = c.key;
                const isCursor = showCursor && k === cursorKey;
                const isTyped = k === null ? (line.find((x) => x.key !== null)?.key ?? 0) <= typed : k < typed;
                const isWrong = k !== null && k >= typed && k < typed + wrong.length;
                if (c.newline && !isCursor && !isWrong) return null;
                const style: React.CSSProperties = {
                  color: isWrong ? role.error : isTyped ? tokenColor(c.type) : syntax.untyped,
                };
                if (isWrong) {
                  style.textDecoration = "underline";
                  style.textDecorationThickness = 3;
                  style.textUnderlineOffset = 6;
                }
                if (isCursor) {
                  style.background = role.accent;
                  style.color = role.text;
                  style.borderRadius = 3;
                }
                if (c.newline) style.color = isCursor ? role.text : style.color;
                return (
                  <span key={ci} style={style}>
                    {c.ch}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </pre>
    </div>
  );
};
