import { useState, useEffect, useRef, useMemo, useCallback } from "react";

export default function useTypingState(tokens, stats) {
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

  // Skip to next valid token
  const skipUntilTypable = useCallback(
    (startLine = 0, startToken = 0) => {
      setTyped(0);
      setWrong("");
      let li = startLine;
      let ti = startToken;
      while (li < lines.length) {
        while (ti < lines[li].length) {
          const token = lines[li][ti];

          // Skip tokens marked as skip
          if (token.skip) {
            ti++;
            continue;
          }

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
    [lines, finish],
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
    if (!started) setStarted(performance.now());

    if (
      key.length === 1 ||
      key === "Backspace" ||
      key === "Enter" ||
      key === "Tab"
    )
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
    if (
      (key === " " || key === "Tab") &&
      currToken.type === "space" &&
      !wrong
    ) {
      stats.current.correct++;
      moveForwardLine();
      return;
    }

    // Ignore other non-character keys
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
