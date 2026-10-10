"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

import TypingRenderer from "@/components/typing/TypingRenderer";
import Button from "@/components/ui/Button";
import { useTypingState } from "@/components/typing/hooks/useTypingState";
import { calculateStats } from "@/components/typing/utils/calculateStats";
import quicksortTokens from "@/data/quicksort.json";

const TOKENS = quicksortTokens.tokens;
const WRONG_CHARS = "asdfjklqwertyuiopzxcvbnm";

// Typing delays in ms
const typeDelay = () => 40 + Math.random() * 40;
const backspaceDelay = () => 150 + Math.random() * 50;
const BACKSPACE_PAUSE = 300;
const TYPO_CHANCE = 0.05 / 4; // per keystroke (~5% per token before)

// A fake key event for useTypingState's handleKey
const keyEvent = (key) => ({
  key,
  metaKey: false,
  ctrlKey: false,
  altKey: false,
  preventDefault() {},
});

// The key the engine expects next
function expectedKey(currToken, typed) {
  if (currToken.type === "newline") return "Enter";
  if (currToken.type === "space") return " ";
  return currToken.content?.[typed] ?? null;
}

// Landing page demo: a bot types quicksort through the real typing engine
// (useTypingState), so the demo always behaves like the real test
function DemoRun({ onRestart }) {
  const [playing, setPlaying] = useState(true);
  const stats = useRef({ correct: 0, incorrect: 0, backspace: 0 });
  const currentLineRef = useRef(null);

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
    handleKey,
    shouldShowCursor,
  } = useTypingState(TOKENS, stats);

  // The timer loop reads the latest render's state and handler
  const latest = useRef(null);
  latest.current = { handleKey, currToken, typed, wrong };

  useEffect(() => {
    if (!playing || done) return;

    let timeout;
    let typoLeft = 0;
    let pausedBeforeBackspace = false;

    const tick = () => {
      const { handleKey, currToken, typed, wrong } = latest.current;
      let delay;

      if (typoLeft > 0) {
        // Type wrong characters
        typoLeft--;
        handleKey(
          keyEvent(WRONG_CHARS[Math.floor(Math.random() * WRONG_CHARS.length)]),
        );
        delay = typeDelay();
      } else if (wrong.length > 0) {
        // Pause, then backspace the typo away
        if (!pausedBeforeBackspace) {
          pausedBeforeBackspace = true;
          timeout = setTimeout(tick, BACKSPACE_PAUSE);
          return;
        }
        handleKey(keyEvent("Backspace"));
        delay = backspaceDelay();
      } else {
        pausedBeforeBackspace = false;
        const key = expectedKey(currToken, typed);
        if (key === null) return;

        if (key.length === 1 && Math.random() < TYPO_CHANCE) {
          typoLeft = 1 + Math.floor(Math.random() * 5);
          timeout = setTimeout(tick, typeDelay());
          return;
        }

        handleKey(keyEvent(key));
        delay = typeDelay();
        // Short pause between words, like the old demo
        if (typed + 1 >= (currToken.content?.length ?? 1)) {
          delay += Math.random() * 150;
        }
      }

      timeout = setTimeout(tick, delay);
    };

    timeout = setTimeout(tick, typeDelay());
    return () => clearTimeout(timeout);
  }, [playing, done]);

  // Refresh the header stats every half second (frozen while paused)
  const [{ wpm, acc }, setLiveStats] = useState({ wpm: 0, acc: 100 });
  useEffect(() => {
    if (!started || !playing) return;
    const update = () => setLiveStats(calculateStats(started, null, stats));
    if (done) return update();

    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, [started, playing, done]);

  const buttonClick = () => (done ? onRestart() : setPlaying((p) => !p));

  return (
    <div className="relative rounded-sm overflow-hidden border border-border bg-bg-2">
      <div className="flex items-center text-fg-2 text-sm px-4 py-2 border-b border-border bg-bg-3">
        <div className="flex space-x-2">
          <div className="size-3 rounded-full bg-red-400" />
          <div className="size-3 rounded-full bg-yellow-400" />
          <div className="size-3 rounded-full bg-green-400" />
        </div>
        <div className="ml-4">quicksort.py</div>
        <div className="ml-auto flex flex-row gap-4">
          <div className="flex flex-row gap-2">
            wpm <span className="text-fg">{wpm}</span>
          </div>
          <div className="flex flex-row gap-2">
            acc <span className="text-fg">{acc}%</span>
          </div>
        </div>
      </div>
      <div className="relative p-4">
        <TypingRenderer
          tokens={TOKENS}
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
        <Button
          variant="tertiary"
          size="icon"
          onClick={buttonClick}
          aria-label={
            done ? "Restart demo" : playing ? "Pause demo" : "Play demo"
          }
          className="absolute bottom-4 right-4 rounded-full"
        >
          {done ? (
            <RotateCcw className="size-4" />
          ) : playing ? (
            <Pause className="size-4" />
          ) : (
            <Play className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default function CodeBox() {
  const [run, setRun] = useState(0);
  return <DemoRun key={run} onRestart={() => setRun((r) => r + 1)} />;
}
