"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import StatPanel from "@/components/StatPanel";
import useTypingState from "./useTypingState";
import useAutoScroll from "./useAutoScroll";
import TypingRenderer from "./TypingRenderer";
import TypingResults from "./TypingResults";

export default function TypingTest({ tokens }) {
	// Stats reference
	const stats = useRef({ correct: 0, incorrect: 0, backspace: 0 });

	const {
		lineIdx,
		tokenIdx,
		typed,
		wrong,
		started,
		done,
		currToken,
		cursorTokenIndices,
		lastTypableTokenIndex,
		lastWordIdx,
		textareaRef,
		handleKey,
		shouldShowCursor
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
	useEffect(() => textareaRef.current?.focus(), []);

	return (
		<div className="relative select-none" onClick={() => textareaRef.current?.focus()}>
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
					<StatPanel
						started={started}
						done={done}
						stats={stats}
					/>
				</>
			) : (
				<TypingResults
					started={started}
					stats={stats}
				/>
			)}
		</div>
	);
} 
