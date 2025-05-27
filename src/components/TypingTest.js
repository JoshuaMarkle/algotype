"use client";

import { useState, useEffect, useRef, useMemo } from "react";

// The typing test given tokens
export default function TypingTest({ tokens, onComplete }) {
	// Normalize token list
	const flatTokens = useMemo(() => {
		if (!Array.isArray(tokens)) return [];
		const lines = Array.isArray(tokens[0]) ? tokens : tokens.tokens ?? tokens; // allow wrapped
		if (!Array.isArray(lines[0])) return lines; // already flat

		// Mark each line
		const out = [];
		lines.forEach((line, idx) => {
			// push real tokens
			out.push(...line);

			// append newline token with autoSkip if line is empty/whitespace
			if (idx !== lines.length - 1) {
				const blank = line.length === 0 || line.every(t => /^\\s*$/.test(t.content));
				out.push({ content: "\\n", newline: true, autoSkip: blank, color: "#666" });
			}
		});
		return out;
	}, [tokens]);

	// State
	const [tokenIdx, setTokenIdx] = useState(0);
	const [typed, setTyped] = useState(0);       // correct chars in current token
	const [wrong, setWrong] = useState("");      // wrong chars inside token (≤10)
	const [extras, setExtras] = useState("");    // collateral extras after token (≤10)

	const [started, setStarted] = useState(null);
	const [done, setDone] = useState(false);
	const stats = useRef({ correct: 0, incorrect: 0, extras: 0, backspace: 0 });

	// Helpers
	const currToken = flatTokens[tokenIdx] ?? { content: "", color: "#fff" };
	const isNewlineTok = currToken.newline;

	const skipLeadingWhitespace = (token) => {
		if (!token || token.newline) return 0;
		const m = token.content.match(/^[ \t]+/);
		return m ? m[0].length : 0;
	};

	const resetForNext = () => {
		setTokenIdx((i) => i + 1);
		setTyped(0);
		setWrong("");
		setExtras("");
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

		// Auto-skip blank lines
		if (currToken.newline && currToken.autoSkip) {
			console.log("SKIPPING LINE")
			resetForNext();
			return;
		}

		// Auto-skip leading space/tabs
		if (
			typed === 0 && wrong === "" && extras === "" && !isNewlineTok && // nothing typed / not a newline
				/^\\s+$/.test(currToken.content) &&                          // token is ONLY whitespace
				(tokenIdx === 0 || flatTokens[tokenIdx - 1].newline)         // it's first token of a physical line
		) {
			// mark the whole indent as already typed
			setTyped(currToken.content.length);
			stats.current.correct += currToken.content.length;
			return;                      // wait for next key-press
		}

		// prevent default typing behaviour but still allow shortcuts (ctrl+c etc)
		if (key.length === 1 || key === "Backspace" || key === "Enter")
			e.preventDefault();

		const expected = currToken.content; // current token

		// BACKSPACE
		if (key === "Backspace") {
			if (extras) {
				setExtras((s) => s.slice(0, -1));
			} else if (wrong) {
				setWrong((s) => s.slice(0, -1));
			} else if (typed > 0) {
				setTyped((c) => c - 1);
			}
			stats.current.backspace++;
			return;
		}

		// ENTER / Newline
		if (key === "Enter") {
			if (isNewlineTok) {
				resetForNext();
				stats.current.correct++;
			} else if (wrong.length < 10) {
				setWrong((s) => s + "↵");
				stats.current.incorrect++;
			}
			return;
		}

		// non‑printables ignored
		if (key.length !== 1) return;

		// Within token body
		if (typed < expected.length) {
			if (key === expected[typed]) {
				setTyped((c) => c + 1);
				stats.current.correct++;
			} else if (wrong.length < 10) {
				setWrong((s) => s + key);
				stats.current.incorrect++;
			}
			return;
		}

		// Collateral extras
		if (extras.length < 10) {
			setExtras((s) => s + key);
			stats.current.incorrect++;
			stats.current.extras++;
		}
	};

	// Detect token completion
	useEffect(() => {
		if (!currToken) return;
		const tokenDone = typed === currToken.content.length && wrong === "";
		if (tokenDone && extras === "") {
			if (tokenIdx === flatTokens.length - 1) finish();
				else resetForNext();
		}
	}, [typed, wrong, extras]);

	// Cursor helpers
	const nextChar = currToken.content[typed] ?? (isNewlineTok ? "\n" : extras ? extras[0] : "");
	const cursorChar = nextChar === "\n" ? "↵" : nextChar;

	// Render token stream
	const textareaRef = useRef();
	useEffect(() => textareaRef.current?.focus(), []);

	return (
		<div className="relative select-none" onClick={() => textareaRef.current?.focus()}>
			<textarea ref={textareaRef} onKeyDown={handleKey} className="absolute w-0 h-0 opacity-0" />

			<pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
				{flatTokens.map((tok, idx) => {
					if (tok.newline) return <br key={idx} />;

					const isPast = idx < tokenIdx;
					const isCurrent = idx === tokenIdx;

					if (isPast) {
						return (
							<span key={idx} style={{ color: tok.color }}>{tok.content}</span>
						);
					}

					if (isCurrent) {
						const correct = tok.content.slice(0, typed);
						const remaining = tok.content.slice(typed+1);

						return (
							<span key={idx}>
								{/* correct typed portion */}
								{correct && <span style={{ color: "#fff" }}>{correct}</span>}

								{/* cursor block */}
								<span style={{ background: "rgba(200,200,255,0.25)" }}>{cursorChar}</span>

								{/* wrong inside token */}
								{wrong && <span style={{ color: "#f44" }}>{wrong}</span>}

								{/* remaining to type */}
								{remaining && <span style={{ color: "#555" }}>{remaining}</span>}

								{/* collateral extras */}
								{extras && <span style={{ color: "#f5f" }}>{extras}</span>}
							</span>
						);
					}

					// future tokens
					return (
						<span key={idx} style={{ color: "#555" }}>{tok.content}</span>
					);
				})}
			</pre>
		</div>
	);
}
