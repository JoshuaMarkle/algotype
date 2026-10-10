"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";

export function useTypingState(tokens, stats) {
  // Current line/token pair
  const [lineIdx, setLineIdx] = useState(0);
  const [tokenIdx, setTokenIdx] = useState(0);

  // Typing test state
  const [typed, setTyped] = useState(0);
  const [wrong, setWrong] = useState("");
  const [started, setStarted] = useState(null);
  const [done, setDone] = useState(false);

  // Scrolling
  const textareaRef = useRef();

  // Current token
  const lines = tokens; // Easier understanding
  const currToken = lines[lineIdx]?.[tokenIdx] ?? { content: "", skip: true };
  const lastWordIdx = tokenIdx + ((currToken.wlength ?? 1) - 1);

  const { lastLine, lastToken } = useMemo(() => {
    for (let li = lines.length - 1; li >= 0; li--) {
      const idx = lines[li].findLastIndex((t) => !t.skip);
      if (idx !== -1) return { lastLine: li, lastToken: idx };
    }
    return { lastLine: 0, lastToken: 0 };
  }, [lines]);

  const shouldShowCursor = true;

  // Move to next token or line
  const moveForwardLine = () => {
    skipUntilTypable(lineIdx, tokenIdx + 1);
  };

  // Mark the session as finished
  const finish = useCallback(() => {
    if (done) return;
    setDone(true);
  }, [done]);

  // Lines with something to type. A line holding only indentation, a
  // newline and comments (older token data) is skipped as a whole
  const typableLines = useMemo(
    () =>
      lines.map((line) =>
        line.some(
          (t) =>
            !t.skip &&
            t.type !== "space" &&
            t.type !== "newline" &&
            t.content?.length > 0,
        ),
      ),
    [lines],
  );

  // Is there a non-newline token to type after this position?
  const hasTypableAfter = useCallback(
    (line, token) => {
      for (let li = line; li < lines.length; li++) {
        if (!typableLines[li]) continue;
        const start = li === line ? token + 1 : 0;
        for (let ti = start; ti < lines[li].length; ti++) {
          const t = lines[li][ti];
          if (t.skip || t.type === "newline") continue;
          if (t.type === "space" || t.content?.length > 0) return true;
        }
      }
      return false;
    },
    [lines, typableLines],
  );

  // Skip to next valid token
  const skipUntilTypable = useCallback(
    (startLine = 0, startToken = 0) => {
      setTyped(0);
      setWrong("");
      let li = startLine;
      let ti = startToken;
      while (li < lines.length) {
        while (typableLines[li] && ti < lines[li].length) {
          const token = lines[li][ti];

          // Skip tokens marked as skip
          if (token.skip) {
            ti++;
            continue;
          }

          // A trailing newline has nothing after it to type, so the
          // test ends on the last character instead of waiting for Enter
          if (token.type === "newline" && !hasTypableAfter(li, ti)) break;

          // Valid token
          if (
            token.type === "newline" ||
            token.type === "space" ||
            (token.content && token.content.length > 0)
          ) {
            setLineIdx(li);
            setTokenIdx(ti);
            return;
          }
          ti++;
        }
        li++;
        ti = 0;
      }

      // Reached end of content
      finish();
    },
    [lines, typableLines, finish, hasTypableAfter],
  );

  // Skip forward at the start
  useEffect(() => {
    skipUntilTypable();
  }, [skipUntilTypable]);

  // Count characters left in the word
  const roomUntilBoundary = () => {
    const line = lines[lineIdx];
    const wordEnd = tokenIdx + (currToken.wlength ?? 1) - 1;

    let room = 0;
    for (let ti = tokenIdx; ti <= wordEnd; ti++) {
      const t = line[ti];
      const off = ti === tokenIdx ? typed + wrong.length : 0;
      room += (t.content?.length ?? 0) - off;
    }

    return room;
  };

  // Indicies of all tokens in current word
  const cursorTokenIndices = useMemo(() => {
    const set = new Set();
    const wordEnd = tokenIdx + (currToken.wlength ?? 1) - 1;
    for (let ti = tokenIdx; ti <= wordEnd; ti++) {
      set.add(ti);
    }

    return set;
  }, [tokenIdx, currToken.wlength]);

  // Handle keyboard input
  const handleKey = (e) => {
    if (done) return;
    const key = e.key;
    if (key == "Tab") return;

    // Leave browser/OS shortcuts alone (Cmd+R, Ctrl+L, ...). Ctrl+Alt is
    // AltGr on Windows layouts, which types characters like { and [
    if (e.metaKey || (e.ctrlKey && !e.altKey)) return;

    // Only typing keys start the timer (not Shift, arrows, ...)
    const isTypingKey =
      key.length === 1 || key === "Backspace" || key === "Enter";
    if (!isTypingKey) return;
    if (!started) setStarted(performance.now());

    e.preventDefault();

    const expected = currToken.content;

    // Backspace
    if (key === "Backspace") {
      if (wrong) {
        setWrong((w) => w.slice(0, -1));
      } else if (typed > 0) {
        setTyped((t) => t - 1);
      }
      stats.current.backspace++;
      return;
    }

    // Enter
    if (key === "Enter" && currToken.type === "newline" && !wrong) {
      stats.current.correct++;
      moveForwardLine();
      return;
    }

    // Space
    if (key === " " && currToken.type === "space" && !wrong) {
      stats.current.correct++;
      moveForwardLine();
      return;
    }

    // Ignore a stray Enter
    if (key.length !== 1) return;

    // Correct
    const capacity = roomUntilBoundary();
    if (capacity > 0 && key === expected[typed] && !wrong) {
      stats.current.correct++;

      // Last character of line? Move to next line
      if (typed + 1 >= expected.length) {
        moveForwardLine();
      } else {
        setTyped((t) => t + 1);
      }
      return;
    }

    // Incorrect
    if (wrong.length < 10) {
      setWrong((w) => w + key);
      stats.current.incorrect++;
    }
  };

  return {
    lineIdx,
    tokenIdx,
    typed,
    wrong,
    started,
    done,
    currToken,
    cursorTokenIndices,
    lastWordIdx,
    textareaRef,
    handleKey,
    shouldShowCursor,
  };
}
