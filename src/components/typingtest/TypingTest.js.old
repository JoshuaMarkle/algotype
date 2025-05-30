"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import StatPanel from "@/components/StatPanel"

// The typing test given tokens
export default function TypingTest({ tokens, onComplete }) {
	// Normalize token list
	const flatTokens = useMemo(() => {
		if (!Array.isArray(tokens)) return [];

		const lines = tokens.tokens ?? tokens;
		const out = [];

		lines.forEach((line, idx) => {
			// Flatten tokens but carry line-level skip
			if (!line.tokens || line.tokens.length === 0) {
				// Blank line
				out.push({ content: "\n", newline: true, autoSkip: true, color: "#666" });
				return;
			}

			// Add each token, including its skip flag
			line.tokens.forEach((token, tokIdx) => {
				out.push({ ...token, newline: false });
			});

			// Add newline token unless it's the last line
			if (idx !== lines.length - 1) {
				out.push({ content: "\n", newline: true, autoSkip: line.skip, color: "#666" });
			}
		});

		return out;
	}, [tokens]);

	// State
	const [tokenIdx, setTokenIdx] = useState(0);
	const [typed, setTyped] = useState(0);			// correct chars in current token
	const [wrong, setWrong] = useState("");			// wrong chars inside token (≤10)

	const [started, setStarted] = useState(null);
	const [done, setDone] = useState(false);
	const stats = useRef({ correct: 0, incorrect: 0, backspace: 0 });

	const [wpm, setWpm] = useState(0);
	const [acc, setAcc] = useState(100);

	const currentLineRef = useRef(null);
	const scrollTargetY = useRef(0);
	const scrollRaf = useRef(null);

	// Helpers
	const currToken = flatTokens[tokenIdx] ?? { content: "", color: "#fff" };
	const isNewlineTok = currToken.newline;

	const shouldShowCursor = (tok, idx) =>
		cursorTokenIndices.has(idx) && !tok.skip && !tok.autoSkip;

	const skipUntilNextTypable = () => {
		let i = tokenIdx;
		while (
			i < flatTokens.length &&
				(flatTokens[i]?.skip || flatTokens[i]?.autoSkip)
		) {
			const skipLength = flatTokens[i].content?.length || 0;
			i++;
		}
		
		// Check finish
		if (i > lastTypableTokenIndex) {
			finish();
			return;
		}

		if (i !== tokenIdx) {
			setTokenIdx(i);
			setTyped(0);
			setWrong("");
		}
	};

	const resetForNext = () => {
		setTokenIdx((i) => i + 1);
		setTyped(0);
		setWrong("");
		setTimeout(skipUntilNextTypable, 0);

		// Scroll
		if (currentLineRef.current) {
			const rect = currentLineRef.current.getBoundingClientRect();
			const middleY = window.scrollY + rect.top - (window.innerHeight / 2) + rect.height / 2;
			scrollTargetY.current = middleY;
		}
	};

	const finish = () => {
		if (done) return;
		setDone(true);
		const end = performance.now();
		onComplete?.({ durationMs: end - started, ...stats.current });
	};

	// How many characters from (tokenIdx, typed+wrong) until first " " or newline
	const roomUntilBoundary = () => {
		let i = tokenIdx;
		let offsetInToken = typed + wrong.length;
		let room = 0;

		// Loop over tokens
		while (i < flatTokens.length) {
			const tk = flatTokens[i];

			// Newline token -> boundary
			if (tk.newline)
				return room;

			// Loop over chars in token until space/tab/newline
			const start = i === tokenIdx ? offsetInToken : 0;
			for (let j = start; j < tk.content.length; j++) {
				const ch = tk.content[j];
				if (ch === " " || ch === "\t")
					return room;

				room++;
			}

			i++;
			offsetInToken = 0;
		}

		return room;
	};

	// Key handling
	const handleKey = (e) => {
		if (done) return;
		const key = e.key;
		if (!started) setStarted(performance.now());

		// Auto-skip empty lines
		if (currToken.newline && currToken.autoSkip) {
			resetForNext();
			return;
		}

		// Auto-skip tagged tokens
		if (currToken.skip) {
			setTyped(currToken.content.length);
			return;
		}

		// Prevent default typing (except shortcuts)
		if (key.length === 1 || key === "Backspace" || key === "Enter" || key === "Tab")
			e.preventDefault();

		const expected = currToken.content;

		// Backspace
		if (key === "Backspace") {
			if (wrong)
				setWrong(w => w.slice(0, -1));
			else if (typed > 0)
				setTyped(t => t - 1);

			stats.current.backspace++;
			return;
		}

		// Enter (newline)
		if (key === "Enter" && isNewlineTok && !wrong) {
			resetForNext(); 
			stats.current.correct++;
			return;
		}

		// Ignore non-printabl
		if (key.length !== 1) 
			return;

		// Ignore space
		if (key === " " && (expected[typed] !== " " && expected[typed] !== "\t" || wrong))
			return;

		// Space
		const isWhitespaceKey = key === " " || key === "Tab";
		const atWhitespace    = expected[typed] === " " || expected[typed] === "\t";
		if (isWhitespaceKey) {
			// Ignore if wrong-stack is not empty or next char is not whitespace
			if (wrong || !atWhitespace)
				return;

			let advance = 0;
			let iTok  = tokenIdx;
			let iPos  = typed;

			while (iTok < flatTokens.length) {
				const tk = flatTokens[iTok];

				// Stop at newline token
				if (tk.newline)
					break;

				const text = tk.content;
				for (let j = iTok === tokenIdx ? iPos : 0; j < text.length; j++) {
					const ch = text[j];

					// First non-whitespace
					if (ch !== " " && ch !== "\t") 
						break;

					advance++;
					iPos++;

					// Move to next token
					if (iPos >= text.length) {
						iTok++;
						iPos = 0;
					}
				}

				if (iTok >= flatTokens.length) 
					break;

				// Stop outer while if current position not whitespace
				const nextTk = flatTokens[iTok];
				if (nextTk.newline)
					break;
				if (nextTk.content[iPos] !== " " && nextTk.content[iPos] !== "\t")
					break;
			}

			// Apply the advance
			setTyped(t => t + advance);
			stats.current.correct += advance;
			return;
		}

		// Typing logic
		const capacity = roomUntilBoundary();

		// Correct char (nothing is wrong stack)
		if (capacity > 0 && key === expected[typed] && !wrong) {
			setTyped(t => t + 1);
			stats.current.correct++;
			return;
		}

		// Track wrong characters
		if (expected[typed] !== " " && expected[typed] != "\n" && wrong.length < 10) {
			setWrong(w => w + key);
			stats.current.incorrect++;
			return;
		}
	};

	useEffect(() => {
		skipUntilNextTypable();
	}, [tokenIdx]);

	// Smooth scroll when focused line changes
	useEffect(() => {
		if (!started || done)
			return;

		const frame = requestAnimationFrame(() => {
			if (!currentLineRef.current) return;

			const rect = currentLineRef.current.getBoundingClientRect();
			const middleY = window.scrollY + rect.top - window.innerHeight / 2 + rect.height / 2;
			scrollTargetY.current = middleY;

			const scrollStep = () => {
				const currentScroll = window.scrollY;
				const diff = scrollTargetY.current - currentScroll;
				const delta = diff * 0.15;

				if (Math.abs(diff) > 1) {
					window.scrollTo(0, currentScroll + delta);
					scrollRaf.current = requestAnimationFrame(scrollStep);
				} else {
					cancelAnimationFrame(scrollRaf.current);
				}
			};

			cancelAnimationFrame(scrollRaf.current);
			scrollRaf.current = requestAnimationFrame(scrollStep);
		});

		return () => cancelAnimationFrame(frame);
	}, [tokenIdx, typed]);

	// Disable scrolling when playing
	useEffect(() => {
		if (started && !done) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		// Clean up in case component unmounts
		return () => {
			document.body.style.overflow = "";
		};
	}, [started, done]);

	useEffect(() => {
		if (!currToken) return;
		const tokenDone = typed === currToken.content.length && wrong === "";
		if (tokenDone) {
			if (tokenIdx === lastTypableTokenIndex) {
				finish();
			} else {
				resetForNext();
			}
		}
	}, [typed, wrong]);

	// Real-time WPM + Accuracy updates
	useEffect(() => {
		if (!started || done) return;

		const interval = setInterval(() => {
			const now = performance.now();
			const minutes = (now - started) / 1000 / 60;
			const correct = stats.current.correct;
			const incorrect = stats.current.incorrect;

			// WPM: words per minute = correct chars / 5 / minutes
			const grossWpm = correct / 5 / minutes;

			// Accuracy: correct / (correct + incorrect)
			const totalTyped = correct + incorrect;
			const accPct = totalTyped > 0 ? (correct / totalTyped) * 100 : 100;

			setWpm(Math.round(grossWpm));
			setAcc(Math.round(accPct));
		}, 250); // update every 250ms

		return () => clearInterval(interval);
	}, [started, done]);

	const lastTypableTokenIndex = useMemo(() => {
		return flatTokens.findLastIndex(tok => !tok.skip && !tok.autoSkip && !tok.newline);
	}, [flatTokens]);

	// Compute token indices that belong to the current word
	const cursorTokenIndices = useMemo(() => {
		const indices = new Set();
		let i = tokenIdx;
		let offsetInToken = typed + wrong.length;

		while (i < flatTokens.length) {
			const tk = flatTokens[i];
			if (tk.newline) break;

			indices.add(i);

			const start = i === tokenIdx ? offsetInToken : 0;
			for (let j = start; j < tk.content.length; j++) {
				const ch = tk.content[j];
				if (ch === " " || ch === "\t") return indices;
			}

			i++;
			offsetInToken = 0;
		}

		return indices;
	}, [tokenIdx, typed, wrong, flatTokens]);

	// Find the index of the last token that belongs to the active word
	const lastWordIdx = useMemo(() => {
		if (cursorTokenIndices.size === 0) return -1;
		return Math.max(...cursorTokenIndices);
	}, [cursorTokenIndices]);

	let cursorChar = currToken.content[typed];
	const textareaRef = useRef();
	useEffect(() => textareaRef.current?.focus(), []);

	// Render
	const cursorPosGlobal = typed + wrong.length; // offset in the word
	let wordOffset = 0; // running offset while walking tokens
	let wrongLeft = wrong.length; // wrong chars still to paint red
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

			<pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
				{flatTokens.map((tok, idx) => {
					const showCursor = shouldShowCursor(tok, idx);

					// Newline tokens
					if (tok.newline) {
						const ref = showCursor ? currentLineRef : undefined;
						return showCursor ? (
							<span key={idx}>
								<span ref={ref} style={{ background: "rgba(200,200,255,0.25)" }}>↵</span>
								<br />
							</span>
						) : (
								<br key={idx} />
							);
					}

					// Zone flags
					const isPast = idx < tokenIdx;
					const inWord = cursorTokenIndices.has(idx);

					// Past tokens - highlight
					if (isPast) {
						return (
							<span key={idx} style={{ color: tok.color }}>
								{tok.content}
							</span>
						);
					}

					// Future tokens - gray out
					if (!inWord) {
						return (
							<span key={idx} style={{ color: "#555" }}>
								{tok.content}
							</span>
						);
					}

					// Current word logic
					const chars = tok.content.split("");
					const rendered = chars.map((ch, charIdx) => {
						const globalPos = wordOffset + charIdx; // position in the word
						const cursorHere = showCursor && globalPos === cursorPosGlobal;

						// Colors
						let color = "#555"; // default future token color

						// Part already typed in tokenIdx
						if (idx === tokenIdx && charIdx < typed)
							color = "#fff";

						// Wrong-stack overflow across tokens
						else if (wrongLeft > 0 && globalPos >= typed && ch !== " " && ch !== "\t") {
							color = "#f44";
							wrongLeft--;
						}

						// Ref (scroll)
						const ref = cursorHere ? currentLineRef : undefined;

						return (
							<span
								ref={ref}
								key={charIdx}
								style={{
									color: cursorHere ? "#fff" : color,
									background: cursorHere ? "rgba(200,200,255,.25)" : undefined,
								}}
							>
								{ch}
							</span>
						);
					});

					wordOffset += chars.length; // advance running offset

					// Overflow wrong chars (at end of word)
					let overflowSpan = null;
					let overflowText = ""
					if (idx === lastWordIdx && wrongLeft > 0) {
						overflowText = wrong.slice(-wrongLeft);
						overflowSpan = (
							<span style={{ color: "#f44" }} key="ovf">
								{overflowText}
								<span style={{background: "rgba(200,200,255,.25)"}}> </span>
							</span>
						);
					}

					return <span key={idx}>{rendered}{overflowSpan}</span>;
				})}
			</pre>
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
