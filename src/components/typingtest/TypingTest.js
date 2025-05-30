"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import StatPanel from "@/components/StatPanel";
import useTypingState from "./useTypingState";
import useAutoScroll from "./useAutoScroll";
import useTypingStats from "./useTypingStats";
import TypingRenderer from "./TypingRenderer";

export default function TypingTest({ tokens }) {
	const {
		lineIdx, setLineIdx,
		tokenIdx, setTokenIdx,
		typed, setTyped,
		wrong, setWrong,
		started, setStarted,
		done, setDone,
		currToken,
		cursorTokenIndices,
		lastTypableTokenIndex,
		lastWordIdx,
		textareaRef,
		handleKey,
		moveForward,
		resetForNext,
		finish,
		shouldShowCursor
	} = useTypingState(tokens);

	// Main stats
	const stats = useRef({ correct: 0, incorrect: 0, backspace: 0 });
	const { wpm, acc } = useTypingStats(started, done, stats);

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
	useEffect(() => textareaRef.current?.focus(), []);

	return (
		<div className="relative select-none" onClick={() => textareaRef.current?.focus()}>
			<textarea
				ref={textareaRef}
				onKeyDown={handleKey}
				className="absolute w-0 h-0 opacity-0"
			/>
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
			<StatPanel
				wpm={wpm}
				acc={acc}
				correct={stats.current.correct}
				incorrect={stats.current.incorrect}
				backspace={stats.current.backspace}
				visible={!done}
			/>
		</div>
	);
} 
