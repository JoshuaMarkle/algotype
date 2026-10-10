// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useTypingState } from "@/components/typing/hooks/useTypingState";

// Token lines shaped like generateTokens.js output:
//   "  if( x"   (indent skipped, "if(" is one word of two tokens)
//   "// note"   (comment-only line, fully skipped)
//   "y"
const TOKENS = [
  [
    { type: "space", content: "  ", skip: true },
    { type: "keyword", content: "if", wlength: 2 },
    { type: "punctuation", content: "(", wlength: 1 },
    { type: "space", content: " " },
    { type: "plain", content: "x", wlength: 1 },
    { type: "newline", content: "↵" },
  ],
  [{ type: "comment", content: "// note", skip: true }],
  [
    { type: "plain", content: "y", wlength: 1 },
    { type: "newline", content: "↵" },
  ],
];

function setup(tokens = TOKENS) {
  const stats = { current: { correct: 0, incorrect: 0, backspace: 0 } };
  const hook = renderHook(() => useTypingState(tokens, stats));
  return { ...hook, stats };
}

function press(result, key) {
  const event = { key, preventDefault: vi.fn() };
  act(() => {
    result.current.handleKey(event);
  });
  return event;
}

function type(result, keys) {
  for (const key of keys) press(result, key);
}

describe("useTypingState", () => {
  it("skips leading skip tokens on mount", () => {
    const { result } = setup();
    expect(result.current.lineIdx).toBe(0);
    expect(result.current.tokenIdx).toBe(1);
    expect(result.current.currToken.content).toBe("if");
    expect(result.current.started).toBeNull();
    expect(result.current.done).toBe(false);
  });

  it("marks every token of the current word for the cursor", () => {
    const { result } = setup();
    expect([...result.current.cursorTokenIndices]).toEqual([1, 2]);
    expect(result.current.lastWordIdx).toBe(2);
  });

  it("advances through a token one correct key at a time", () => {
    const { result, stats } = setup();
    press(result, "i");
    expect(result.current.typed).toBe(1);
    expect(result.current.tokenIdx).toBe(1);

    press(result, "f");
    expect(result.current.tokenIdx).toBe(2);
    expect(result.current.typed).toBe(0);
    expect(stats.current.correct).toBe(2);
  });

  it("starts the timer on the first typing key, not Tab or modifiers", () => {
    const { result } = setup();
    press(result, "Tab");
    press(result, "Shift");
    press(result, "ArrowLeft");
    expect(result.current.started).toBeNull();

    press(result, "i");
    expect(result.current.started).toEqual(expect.any(Number));
  });

  it("prevents default for typed characters, Backspace and Enter only", () => {
    const { result } = setup();
    expect(press(result, "i").preventDefault).toHaveBeenCalled();
    expect(press(result, "Backspace").preventDefault).toHaveBeenCalled();
    expect(press(result, "Enter").preventDefault).toHaveBeenCalled();
    expect(press(result, "Shift").preventDefault).not.toHaveBeenCalled();
  });

  it("ignores Cmd/Ctrl shortcuts but accepts AltGr characters", () => {
    const { result, stats } = setup();
    const shortcut = { key: "r", metaKey: true, preventDefault: vi.fn() };
    act(() => result.current.handleKey(shortcut));
    act(() =>
      result.current.handleKey({
        key: "l",
        ctrlKey: true,
        preventDefault: vi.fn(),
      }),
    );
    expect(shortcut.preventDefault).not.toHaveBeenCalled();
    expect(result.current.started).toBeNull();
    expect(stats.current.incorrect).toBe(0);

    // AltGr arrives as Ctrl+Alt on Windows
    act(() =>
      result.current.handleKey({
        key: "i",
        ctrlKey: true,
        altKey: true,
        preventDefault: vi.fn(),
      }),
    );
    expect(result.current.typed).toBe(1);
  });

  it("records wrong keys and blocks progress until they are erased", () => {
    const { result, stats } = setup();
    press(result, "z");
    expect(result.current.wrong).toBe("z");
    expect(stats.current.incorrect).toBe(1);

    // The right key does not count while a wrong key is pending
    press(result, "i");
    expect(result.current.wrong).toBe("zi");
    expect(result.current.typed).toBe(0);

    type(result, ["Backspace", "Backspace"]);
    expect(result.current.wrong).toBe("");
    expect(stats.current.backspace).toBe(2);

    press(result, "i");
    expect(result.current.typed).toBe(1);
  });

  it("caps pending wrong keys at 10 and stops counting past the cap", () => {
    const { result, stats } = setup();
    type(result, "zzzzzzzzzzzz".split(""));
    expect(result.current.wrong).toHaveLength(10);
    expect(stats.current.incorrect).toBe(10);
  });

  it("does not backspace into a previous token", () => {
    const { result } = setup();
    type(result, ["i", "f"]);
    expect(result.current.tokenIdx).toBe(2);

    press(result, "Backspace");
    expect(result.current.tokenIdx).toBe(2);
    expect(result.current.typed).toBe(0);
  });

  it("treats Space and Enter as wrong on a non-matching token", () => {
    const { result, stats } = setup();
    press(result, " ");
    expect(result.current.wrong).toBe(" ");
    press(result, "Backspace");

    // Enter is not a single character, so it is ignored entirely
    press(result, "Enter");
    expect(result.current.wrong).toBe("");
    expect(stats.current.incorrect).toBe(1);
  });

  it("completes the test, skipping comment-only lines", () => {
    const { result, stats } = setup();
    type(result, ["i", "f", "(", " ", "x"]);
    expect(result.current.currToken.type).toBe("newline");

    press(result, "Enter");
    expect(result.current.lineIdx).toBe(2);
    expect(result.current.tokenIdx).toBe(0);

    // The trailing newline is not typed: the last character ends the test
    press(result, "y");
    expect(result.current.done).toBe(true);
    expect(stats.current).toEqual({ correct: 7, incorrect: 0, backspace: 0 });
  });

  it("still requires Enter on newlines before the last line", () => {
    const { result } = setup([
      [
        { type: "plain", content: "a", wlength: 1 },
        { type: "newline", content: "↵" },
      ],
      [],
      [{ type: "comment", content: "# end", skip: true }],
      [
        { type: "plain", content: "b", wlength: 1 },
        { type: "newline", content: "↵" },
      ],
      [{ type: "newline", content: "↵" }],
    ]);
    press(result, "a");
    expect(result.current.done).toBe(false);
    expect(result.current.currToken.type).toBe("newline");

    type(result, ["Enter", "b"]);
    expect(result.current.done).toBe(true);
  });

  it("ignores keys after the test is done", () => {
    const { result, stats } = setup([
      [{ type: "plain", content: "a", wlength: 1 }],
    ]);
    press(result, "a");
    expect(result.current.done).toBe(true);

    press(result, "b");
    expect(result.current.wrong).toBe("");
    expect(stats.current.incorrect).toBe(0);
  });

  it("is done immediately when there is nothing to type", () => {
    const { result } = setup([
      [{ type: "comment", content: "# x", skip: true }],
    ]);
    expect(result.current.done).toBe(true);
  });
});
