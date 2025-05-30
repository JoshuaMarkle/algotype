import React from "react";

export default function TypingRenderer({
	tokens,
	lineIdx,
	tokenIdx,
	typed,
	wrong,
	currentLineRef,
	shouldShowCursor,
	cursorTokenIndices,
	lastWordIdx
}) {
	return (
		<pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
			{tokens.map((line, li) => {
				let wordOffset = 0;
				let wrongLeft = li === lineIdx ? wrong.length : 0;

				return (
					<div key={`line-${li}`}>
						{line.map((token, ti) => {
							const showCursor = true;
							const isPast = li < lineIdx || (li === lineIdx && ti < tokenIdx);
							const isFuture = !(cursorTokenIndices.has(ti) && li === lineIdx);
							const tokenTypeClass = `token-${token.type ?? "plain"}`;

							if (token.type === "newline" && (isPast || isFuture)) {
								const isCursorHere =
									li === lineIdx && ti === tokenIdx && typed === 0 && wrong.length === 0;

								if (!isCursorHere) return null; // Skip rendering

								const ref = currentLineRef;
								const className = `token token-newline cursor`;

								return (
									<span key={`${li}-${ti}`} ref={ref} className={className}>
										{token.content}
									</span>
								);
							}

							// Fully typed (past) tokens
							if (isPast) {
								return (
									<span key={`${li}-${ti}`} className={`token ${tokenTypeClass}`}>
										{token.content}
									</span>
								);
							}

							// Not in word? Then future token
							if (isFuture) {
								return (
									<span key={`${li}-${ti}`} className="token token-future">
										{token.content}
									</span>
								);
							}

							// Current token — render each character
							const chars = token.content.split("");
							const rendered = chars.map((ch, charIdx) => {
								const globalPos = wordOffset + charIdx;
								const cursorHere = showCursor && globalPos === typed + wrong.length;

								let charClass = "token";
								if (cursorHere) charClass += " cursor";

								if (ti === tokenIdx && li === lineIdx && charIdx < typed) {
									charClass += ` ${tokenTypeClass}`;
								} else if (wrongLeft > 0 && globalPos >= typed) {
									charClass = "token token-wrong";
									wrongLeft--;
								}

								const ref = cursorHere ? currentLineRef : undefined;

								return (
									<span ref={ref} key={charIdx} className={charClass}>
										{ch === " " ? "\u00A0" : ch}
									</span>
								);
							});

							wordOffset += chars.length;

							// Overflow for extra wrong characters
							let overflowSpan = null;
							if (li === lineIdx && ti === lastWordIdx && wrongLeft > 0) {
								const overflowText = wrong.slice(-wrongLeft);
								overflowSpan = (
									<span className="token token-wrong" key="ovf">
										{overflowText}
										<span className="cursor"> </span>
									</span>
								);
							}

							return (
								<span key={`${li}-${ti}`}>
									{rendered}
									{overflowSpan}
								</span>
							);
						})}
						<br />
					</div>
				);
			})}
		</pre>
	);
}
