"use client";

import { useEffect, useRef } from "react";

import TypingRenderer from "@/components/typing/TypingRenderer";
import TypingResults from "@/components/typing/TypingResults";
import { useTypingState } from "@/components/typing/hooks/useTypingState";
import { useAutoScroll } from "@/components/typing/hooks/useAutoScroll";
import { calculateStats } from "@/components/typing/utils/calculateStats";
import { submitTestHistory } from "@/lib/history";

export default function TypingTest({ tokens, language, mode, slug }) {
  // Stats reference
  const stats = useRef({ correct: 0, incorrect: 0, backspace: 0 });
  let wpmOverTime = useRef([]);

  const {
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
  } = useTypingState(tokens, stats);

  // Scrolling
  const currentLineRef = useRef(null);
  useAutoScroll(started, done, currentLineRef, tokenIdx, typed);

  // Prevent scrolling while typing
  useEffect(() => {
    if (started && !done) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [started, done]);

  // Auto-focus the hidden textarea
  useEffect(() => textareaRef.current?.focus(), [textareaRef]);

  // Store wpm data every 1 seconds
  useEffect(() => {
    if (!started || done) return;

    const interval = setInterval(() => {
      const { wpm, acc, time } = calculateStats(started, stats);
      wpmOverTime.current.push({ wpm, acc, time });
    }, 1000);

    return () => clearInterval(interval);
  }, [started, done, stats]);

  // Return results when done
  useEffect(() => {
    if (started && done) {
      const { wpm, acc, time } = calculateStats(started, stats);
      submitTestHistory({ wpm, acc, time, language, mode, slug });
    }
  }, [started, done, language, mode, slug]);

  return (
    <div
      className="relative select-none"
      onClick={() => textareaRef.current?.focus()}
    >
      <textarea
        ref={textareaRef}
        onKeyDown={handleKey}
        className="absolute w-0 h-0 opacity-0"
      />
      {!done ? ( // If not done, show the typing test; otherwise, the results
        <>
          <TypingRenderer
            tokens={tokens}
            lineIdx={lineIdx}
            tokenIdx={tokenIdx}
            currToken={currToken}
            typed={typed}
            wrong={wrong}
            currentLineRef={currentLineRef}
            shouldShowCursor={shouldShowCursor}
            cursorTokenIndices={cursorTokenIndices}
            lastWordIdx={lastWordIdx}
          />
        </>
      ) : (
        <TypingResults
          started={started}
          stats={stats}
          data={wpmOverTime.current}
        />
      )}
    </div>
  );
}
