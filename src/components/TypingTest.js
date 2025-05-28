"use client";

import { useState, useEffect, useRef, useMemo } from "react";

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
				// blank line
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
	const [typed, setTyped] = useState(0);       // correct chars in current token
	const [wrong, setWrong] = useState("");      // wrong chars inside token (≤10)

	const [started, setStarted] = useState(null);
	const [done, setDone] = useState(false);
	const stats = useRef({ correct: 0, incorrect: 0, backspace: 0 });

	// Helpers
	const currToken = flatTokens[tokenIdx] ?? { content: "", color: "#fff" };
	const isNewlineTok = currToken.newline;

	const shouldShowCursor = (tok, idx) => idx === tokenIdx && !tok.skip && !tok.autoSkip;

	const skipUntilNextTypable = () => {
		let i = tokenIdx;
		while (
			i < flatTokens.length &&
				(flatTokens[i]?.skip || flatTokens[i]?.autoSkip)
		) {
			const skipLength = flatTokens[i].content?.length || 0;
			stats.current.correct += skipLength;
			i++;
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
	};

	const finish = () => {
		if (done) return;
		setDone(true);
		const end = performance.now();
		onComplete?.({ durationMs: end - started, ...stats.current });
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
		if (key.length === 1 || key === "Backspace" || key === "Enter")
			e.preventDefault();

		const expected = currToken.content;

		// Backspace
		if (key === "Backspace") {
			if (wrong) setWrong(w => w.slice(0, -1));
				else if (typed > 0) setTyped(t => t - 1);
			stats.current.backspace++;
			return;
		}

		/* ENTER newline handled only if cursor is on newline token and wrong stack empty */
		if (key === "Enter" && isNewlineTok && !wrong) {
			resetForNext(); 
			stats.current.correct++;
			return;
		}

		/* ignore non-printable */
		if (key.length !== 1) 
			return;

		/* ignore space if cursor char isn’t space OR wrong stack not empty */
		if (key === " " && (expected[typed] !== " " || wrong)) 
			return;

		// Typing logic
		if (typed < expected.length) {
			if (key === expected[typed] && !wrong) {
				// correct char (if nothing in wrong stack)
				setTyped(t => t + 1); stats.current.correct++;
				return;
			}

			// wrong char added only if expected[typed] is NOT space/newline
			if (expected[typed] !== " " && expected[typed] !== "\n" && wrong.length < 10) {
				setWrong(w => w + key); stats.current.incorrect++;
			}
			return;
		}
	};

	useEffect(() => {
		skipUntilNextTypable();
	}, [tokenIdx]);

	useEffect(() => {
		if (!currToken) return;
		const tokenDone = typed === currToken.content.length && wrong === "";
		if (tokenDone) {
			if (tokenIdx === flatTokens.length - 1) finish();
				else resetForNext();
		}
	}, [typed, wrong]);

	let cursorChar = currToken.content[typed];

	const textareaRef = useRef();
	useEffect(() => textareaRef.current?.focus(), []);

	return (
		<div className="relative select-none" onClick={() => textareaRef.current?.focus()}>
			<textarea ref={textareaRef} onKeyDown={handleKey} className="absolute w-0 h-0 opacity-0" />

			<pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
				{flatTokens.map((tok, idx) => {
					if (tok.newline) {
						const showCursor = shouldShowCursor(tok, idx);
						if (showCursor) {
							return (
								<span key={idx}>
									<span style={{ background: "rgba(200,200,255,0.25)" }}>↵</span>
									<br />
								</span>
							);
						}
						return <br key={idx} />;
					}

					const isPast = idx < tokenIdx;
					const isCurrent = shouldShowCursor(tok, idx);

					if (isPast) {
						return (
							<span key={idx} style={{ color: tok.color }}>{tok.content}</span>
						);
					}

					if (isCurrent) {
						const expected = currToken.content;
						const tokenLen = expected.length;

						console.log(`Token: ${expected} Wrong: ${wrong}`)

						// Chars rendered up to tokenLen (will need to render up to the next space/newline not just token)
						return (
							<span key={idx}>
								{expected.split("").map((ch, i) => {
									const cursorHere = i === typed + wrong.length;

									// Color and glyph
									let visualChar = ch; // NEVER show the wrong keystroke
									let color = "#555";  // future default

									if (i < typed) {     // typed correctly
										color = "#fff";
									} else if (i - typed < wrong.length) {
										// Wrong char typed (just paint existing char red)
										color = "#f44";
									}

									// Render cursor
									return (
										<span
											key={i}
											style={{
												color: cursorHere ? "#fff" : color, // char white under cursor
												background: cursorHere ? "rgba(200,200,255,.25)" : undefined,
											}}
										>
											{visualChar}
										</span>
									);
								})}
							</span>
						);
						}

					return (
						<span key={idx} style={{ color: "#555" }}>{tok.content}</span>
					);
				})}
			</pre>
		</div>
	);
}
