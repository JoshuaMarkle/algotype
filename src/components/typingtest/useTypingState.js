import { useState, useRef, useMemo } from "react";

export default function useTypingState(tokens) {
	// Current line/token pair
	const [lineIdx, setLineIdx] = useState(0);
	const [tokenIdx, setTokenIdx] = useState(0);

	// Typing test state
	const [typed, setTyped] = useState(0);
	const [wrong, setWrong] = useState("");
	const [started, setStarted] = useState(null);
	const [done, setDone] = useState(false);
	const stats = useRef({ correct: 0, incorrect: 0, backspace: 0 });

	// Scrolling
	const textareaRef = useRef();

	// Current token
	const lines = tokens; // Easier understanding
	const currToken = lines[lineIdx]?.[tokenIdx] ?? { content:"", skip:true };
	const lastWordIdx = tokenIdx + ((currToken.wlength ?? 1) - 1);

	const { lastLine, lastToken } = useMemo(() => {
		for (let li = lines.length - 1; li >= 0; li--) {
			const idx = lines[li].findLastIndex(t => !t.skip);
			if (idx !== -1) return { lastLine: li, lastToken: idx };
		}
		return { lastLine: 0, lastToken: 0 };
	}, [lines]);

	const shouldShowCursor = true;
	// const shouldShowCursor = (li, ti) =>
	// 	li === lineIdx &&
	// 		cursorTokenIndices.has(ti) &&
	// 		!lines[li][ti].skip;

	// Skip tokens until the next typable one
	const moveForward = () => {
		let li = lineIdx;
		let ti = tokenIdx;
		let pos = typed + 1;

		while (li < lines.length) {
			while (ti < lines[li].length) {
				const token = lines[li][ti];

				// Skip tokens marked as skip
				if (token.skip) {
					ti++;
					pos = 0;
					continue;
				}

				// Newline tokens are valid single-char tokens (no .content)
				if (token.type === "newline") {
					if (pos <= 0) {
						setLineIdx(li);
						setTokenIdx(ti);
						setTyped(pos); // pos will be 1 after typing Enter
						setWrong("");
						return;
					} else {
						ti++;
						pos = 0;
						continue;
					}
				}

				// Space tokens — only allow typing space at position 0
				if (token.type === "space") {
					if (pos === 0) {
						setLineIdx(li);
						setTokenIdx(ti);
						setTyped(pos);
						setWrong("");
						return;
					} else {
						ti++;
						pos = 0;
						continue;
					}
				}

				// Other tokens with content (normal case)
				if (token.content && pos < token.content.length) {
					setLineIdx(li);
					setTokenIdx(ti);
					setTyped(pos);
					setWrong("");
					return;
				}

				// Advance to next token
				ti++;
				pos = 0;
			}
			li++;
			ti = 0;
			pos = 0;
		}

		// End of tokens
		finish();
	};

	// Move to next token or line
	const resetForNext = () => {
		setTyped(0);
		setWrong("");
		moveForward();
	};

	// Mark the session as finished
	const finish = () => {
		if (done) return;
		setDone(true);
		const end = performance.now();
	};

	// Count characters left in the word
	const roomUntilBoundary = () => {
		const line    = lines[lineIdx];
		const wordEnd = tokenIdx + (currToken.wlength ?? 1) - 1;

		let room = 0;
		for (let ti = tokenIdx; ti <= wordEnd; ti++) {
			const t   = line[ti];
			const off = ti === tokenIdx ? typed + wrong.length : 0;
			room += t.content.length - off;
		}

		return room;
	};

	// Indicies of all tokens in current word
	const cursorTokenIndices = useMemo(() => {
		const set     = new Set();
		const wordEnd = tokenIdx + (currToken.wlength ?? 1) - 1;
		for (let ti = tokenIdx; ti <= wordEnd; ti++) {
			set.add(ti);
		}

		return set;
	}, [lineIdx, tokenIdx, currToken.wlength]);

	// Handle keyboard input
	const handleKey = (e) => {
		if (done) return;
		const key = e.key;
		if (!started) setStarted(performance.now());

		// Prevent default key behavior
		if (key.length === 1 || key === "Backspace" || key === "Enter" || key === "Tab")
			e.preventDefault();

		const expected = currToken.content;

		// Backspace
		if (key === "Backspace") {
			if (wrong) {
				setWrong(w => w.slice(0, -1));
			} else if (typed > 0) {
				setTyped(t => t - 1);
			}
			stats.current.backspace++;
			return;
		}

		// Enter
		if (key === "Enter" && currToken.type === "newline" && !wrong) {
			resetForNext();
			stats.current.correct++;
			return;
		}

		// Space
		if ((key === " " || key === "Tab") && currToken.type === "space" && !wrong) {
			resetForNext();
			stats.current.correct++;
			return;
		}

		// Ignore other control keys
		if (key.length !== 1) return;

		// Correct char
		const capacity = roomUntilBoundary();
		if (capacity > 0 && key === expected[typed] && !wrong) {
			setTyped(t => t + 1);
			stats.current.correct++;
			return;
		}

		// Incorrect char
		if (expected[typed] !== " " && expected[typed] != "\n" && wrong.length < 10) {
			setWrong(w => w + key);
			stats.current.incorrect++;
			return;
		}
	};

	return {
		lineIdx, setLineIdx,
		tokenIdx, setTokenIdx,
		typed, setTyped,
		wrong, setWrong,
		started, setStarted,
		done, setDone,
		currToken,
		cursorTokenIndices,
		lastWordIdx,
		textareaRef,
		handleKey,
		resetForNext,
		finish,
		shouldShowCursor
	};
}
