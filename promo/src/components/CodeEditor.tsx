import React from "react";
import { Pause, RotateCcw } from "lucide-react";
import { color, font, hairline, leading, radius, ring, role, space, syntax, text } from "../tokens";
import type { Ch } from "../data/snippet";

// The window's three dots (size-3, gap-2)
export const WindowDots: React.FC = () => (
  <div style={{ display: "flex", gap: space(2) }}>
    {[color.red400, color.yellow400, color.green400].map((bg) => (
      <div key={bg} style={{ width: space(3), height: space(3), borderRadius: "50%", background: bg }} />
    ))}
  </div>
);

// Height of the window's header (py-2.5 around a text-sm line) plus its
// bottom hairline, measured from a still
export const EDITOR_HEADER_H = 77;

// The whole window's height (border box) for `lines` lines of code
export const editorHeight = (lines: number, fontSize: number) =>
  2 * hairline + EDITOR_HEADER_H + space(5) + space(6) + lines * fontSize * leading.relaxed;

const tokenColor = (type: string) =>
  ({
    keyword: syntax.keyword,
    function: syntax.function,
    builtin: syntax.function,
    punctuation: syntax.punctuation,
    operator: syntax.operator,
    number: syntax.number,
    boolean: syntax.number,
    string: syntax.string,
    comment: syntax.comment,
    plain: syntax.plain,
    space: syntax.plain,
  })[type] ?? syntax.plain;

// The homepage's CodeBox demo window (rounded-sm, border, bg-2 body, bg-3
// header with the three dots, file name and live wpm / acc), framed by the
// homepage's ring, rendering code the way TypingRenderer does: line numbers,
// typed text in syntax colours, untyped text in fg-2, wrong keys in the error
// colour with an underline, and the current character in the accent. The
// demo's round tertiary button sits bottom-right: pause while it types,
// restart once `done` (0 → 1 swaps the icon).
export const CodeEditor: React.FC<{
  lines: Ch[][];
  typed: number; // keystrokes typed correctly
  wrong?: number; // wrong keys pending after `typed`
  file: string;
  wpm?: number;
  acc?: number;
  width: number;
  fontSize?: number;
  showCursor?: boolean;
  framed?: boolean;
  done?: number;
}> = ({ lines, typed, wrong = 0, file, wpm = 0, acc = 100, width, fontSize = text.code, showCursor = true, framed = true, done = 0 }) => {
  const cursorKey = typed + wrong;
  const lineOfKey = (k: number) => {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].some((c) => c.key === k)) return i;
    }
    return lines.length - 1;
  };
  const currentLine = lineOfKey(typed);

  return (
    <div
      style={{
        width,
        boxSizing: "border-box",
        background: role.surface,
        border: `${hairline}px solid ${role.border}`,
        borderRadius: radius.sm,
        overflow: "hidden",
        outline: framed ? `${ring.width}px solid ${ring.color}` : undefined,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: `${space(2.5)}px ${space(4)}px`,
          borderBottom: `${hairline}px solid ${role.border}`,
          background: role.surfaceMuted,
          fontFamily: font.sans,
          fontSize: text.sm,
          color: role.textMuted,
        }}
      >
        <WindowDots />
        <div style={{ marginLeft: space(4) }}>{file}</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: space(4), fontVariantNumeric: "tabular-nums" }}>
          <div style={{ display: "flex", gap: space(2) }}>
            wpm <span style={{ color: role.text, minWidth: text.sm * 1.8 }}>{wpm}</span>
          </div>
          <div style={{ display: "flex", gap: space(2) }}>
            acc <span style={{ color: role.text }}>{acc}%</span>
          </div>
        </div>
      </div>
      <div style={{ position: "relative" }}>
      <pre
        style={{
          margin: 0,
          padding: `${space(5)}px ${space(4)}px ${space(6)}px`,
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
                width: fontSize * 1.8,
                marginRight: fontSize * 1.1,
                textAlign: "right",
                color: li === currentLine ? role.textMuted : role.textFaint,
              }}
            >
              {li + 1}
            </div>
            <div style={{ minHeight: fontSize * leading.relaxed }}>
              {line.map((c, ci) => {
                const k = c.key;
                const isCursor = showCursor && k === cursorKey;
                const isTyped = k === null || k < typed;
                const isWrong = k !== null && k >= typed && k < typed + wrong;
                // TypingRenderer hides the newline mark unless the cursor is on it
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
      {/* Button variant="tertiary" size="icon": size-9 rounded-full bg-tertiary (bg-4), size-4 icon */}
      <div
        style={{
          position: "absolute",
          right: space(4),
          bottom: space(4),
          width: space(9),
          height: space(9),
          borderRadius: "50%",
          background: color.bg4,
          color: role.text,
        }}
      >
        {[
          // one icon out, then the other in, so they never overlap
          { Icon: Pause, opacity: Math.max(0, 1 - done * 2) },
          { Icon: RotateCcw, opacity: Math.max(0, done * 2 - 1) },
        ].map(({ Icon, opacity }, i) => (
          <Icon
            key={i}
            size={space(4)}
            strokeWidth={2}
            style={{ position: "absolute", left: space(2.5), top: space(2.5), opacity }}
          />
        ))}
      </div>
      </div>
    </div>
  );
};
