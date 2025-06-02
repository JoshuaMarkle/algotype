"use client";

import { useEffect, useRef, useState } from "react";
import quicksortTokens from "@/data/tokens/quicksort.tokens.json";
import TypingRenderer from "@/components/typingtest/TypingRenderer";
import { Play, Pause, RotateCcw } from "lucide-react";
import { IconButton } from "@/components/ui/Button";
import calculateStats from "@/components/typingtest/calculateStats";

export default function CodeBox() {
  const [playing, setPlaying] = useState(true);
  const [done, setDone] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [tokenIdx, setTokenIdx] = useState(0);
  const [typed, setTyped] = useState(0);
  const [wrong, setWrong] = useState("");

  const stats = useRef({ correct: 0, incorrect: 0 });
  const startedRef = useRef(null);
  const [wpm, setWpm] = useState(0);
  const [acc, setAcc] = useState(100);
  const updateCounterRef = useRef(0);

  const typedRef = useRef(0);
  const wrongRef = useRef("");
  const tokenIdxRef = useRef(0);
  const lineIdxRef = useRef(0);

  const currentLineRef = useRef(null);
  const shouldShowCursor = true;

  const tokens = quicksortTokens;
  const currToken = tokens[lineIdx]?.[tokenIdx] ?? { content: "", skip: true };
  const lastWordIdx = tokenIdx + ((currToken.wlength ?? 1) - 1);

  const cursorTokenIndices = new Set();
  for (let i = tokenIdx; i <= lastWordIdx; i++) {
    cursorTokenIndices.add(i);
  }

  function buttonClick() {
    if (done) {
      restartTest();
    } else {
      setPlaying((p) => !p);
    }
  }

  function restartTest() {
    setPlaying(true);
    setDone(false);
    setLineIdx(0);
    setTokenIdx(0);
    setTyped(0);
    setWrong("");
    typedRef.current = 0;
    wrongRef.current = "";
    tokenIdxRef.current = 0;
    lineIdxRef.current = 0;
    stats.current = { correct: 0, incorrect: 0 };
    startedRef.current = null;
    setWpm(0);
    setAcc(100);
    updateCounterRef.current = 0;
  }

  useEffect(() => {
    if (!playing || done) return;

    const wrongChars = "asdfjklqwertyuiopzxcvbnm"; // Pool of wrong chars
    let timeout;

    const step = () => {
      const line = tokens[lineIdxRef.current];
      const currToken = line?.[tokenIdxRef.current] ?? {
        content: "",
        skip: true,
      };
      const expected = currToken.content;

      const makeTypo = Math.random() < 0.05; // 5% chance of getting something wrong
      const typoLength = makeTypo ? Math.floor(Math.random() * 6) : 0; // Typo length

      let typoProgress = 0;
      let backspacingStarted = false;

      const typeLoop = () => {
        if (!startedRef.current) {
          startedRef.current = performance.now(); // First keystroke starts timer
        }

        let speed;

        if (typoProgress < typoLength) {
          // Simulate typing wrong characters
          typoProgress++;
          const char =
            wrongChars[Math.floor(Math.random() * wrongChars.length)];
          wrongRef.current += char;
          setWrong(wrongRef.current);
          stats.current.incorrect++;
          speed = 40 + Math.random() * 40;
        } else if (wrongRef.current.length > 0) {
          if (!backspacingStarted) {
            backspacingStarted = true;
            timeout = setTimeout(typeLoop, 300); // Pause before backspacing
            return;
          }
          wrongRef.current = wrongRef.current.slice(0, -1);
          setWrong(wrongRef.current);
          speed = 150 + Math.random() * 50; // Slower backspace
        } else if (typedRef.current < expected.length) {
          // Type correct character
          typedRef.current++;
          setTyped(typedRef.current);
          stats.current.correct++;
          speed = 40 + Math.random() * 40;
        } else {
          // End of current token
          const moveToNextValidToken = () => {
            let nextTokenIdx = tokenIdxRef.current + 1;
            let nextLineIdx = lineIdxRef.current;

            while (nextLineIdx < tokens.length) {
              const line = tokens[nextLineIdx];
              while (nextTokenIdx < line.length) {
                if (!line[nextTokenIdx].skip) {
                  tokenIdxRef.current = nextTokenIdx;
                  lineIdxRef.current = nextLineIdx;
                  typedRef.current = 0;
                  setLineIdx(nextLineIdx);
                  setTokenIdx(nextTokenIdx);
                  setTyped(0);
                  timeout = setTimeout(step, Math.random() * 200);
                  return;
                }
                nextTokenIdx++;
              }
              nextLineIdx++;
              nextTokenIdx = 0;
            }

            setDone(true);
            setPlaying(false);
          };

          moveToNextValidToken();
          return;
        }

        updateCounterRef.current++;
        if (updateCounterRef.current % 5 === 0) {
          const { wpm, acc } = calculateStats(startedRef.current, stats);
          setWpm(wpm);
          setAcc(acc);
        }

        timeout = setTimeout(typeLoop, speed);
      };

      typeLoop();
    };

    step();

    return () => clearTimeout(timeout);
  }, [playing, done]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-border bg-bg-2">
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
        <IconButton
          onClick={buttonClick}
          className="absolute bottom-4 right-4 text-fg-2 bg-bg-4 hover:bg-bg-5"
        >
          {done ? (
            <RotateCcw className="size-6" />
          ) : playing ? (
            <Pause className="size-6" />
          ) : (
            <Play className="size-6" />
          )}
        </IconButton>
      </div>
    </div>
  );
}
