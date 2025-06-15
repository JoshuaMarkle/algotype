"use client";

import React, { useState, useEffect, useRef } from "react";

import NavbarTest from "@/components/layouts/NavbarTest";
import TypingRenderer from "@/components/typing/TypingRenderer";
import TypingResults from "@/components/typing/TypingResults";
import { useTypingState } from "@/components/typing/hooks/useTypingState";
import { useAutoScroll } from "@/components/typing/hooks/useAutoScroll";
import { calculateStats } from "@/components/typing/utils/calculateStats";
import { gotoRandomTest } from "@/components/typing/utils/randomTest";
import { submitTestHistory } from "@/lib/history";
import { cn } from "@/lib/utils";

export default function TypingTest({ tokens, language, mode, slug }) {
  const [showNavbar, setShowNavbar] = useState(true);

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

  // Hide/show navbar
  useEffect(() => {
    if (started && !done) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  }, [started, done]);

  // Go to random test if TAB is pressed
  useEffect(() => {
    const handleTabKey = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        gotoRandomTest();
      }
    };

    window.addEventListener("keydown", handleTabKey);
    return () => window.removeEventListener("keydown", handleTabKey);
  }, []);

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
      <div
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out",
          "flex flex-row justify-between px-4 py-2 border-b border-border bg-background",
          showNavbar
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full",
        )}
      >
        <NavbarTest />
      </div>
      {!done ? ( // Change render based on done status
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
