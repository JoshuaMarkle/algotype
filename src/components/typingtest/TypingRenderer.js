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
							// const showCursor = shouldShowCursor(li, ti);

							if (token.type === "newline") {
								const ref = showCursor ? currentLineRef : undefined;
								return (
									<span
										key={`${li}-${ti}`}
										ref={ref}
										style={{
											color: "#888",
											background: showCursor ? "rgba(200,200,255,0.25)" : undefined,
										}}
									>
										↵
									</span>
								);
							}

							const isPast = li < lineIdx || (li === lineIdx && ti < tokenIdx);
							const inWord = cursorTokenIndices.has(ti) && li === lineIdx;

							if (isPast) {
								return (
									<span key={`${li}-${ti}`} style={{ color: token.color }}>
										{token.content}
									</span>
								);
							}

							if (!inWord) {
								return (
									<span key={`${li}-${ti}`} style={{ color: "#555" }}>
										{token.content}
									</span>
								);
							}

							const chars = token.content.split("");
							const rendered = chars.map((ch, charIdx) => {
								const globalPos = wordOffset + charIdx;
								const cursorHere = showCursor && globalPos === typed + wrong.length;

								let color = "#555";
								if (ti === tokenIdx && li === lineIdx && charIdx < typed) {
									color = "#fff";
								} else if (wrongLeft > 0 && globalPos >= typed && ch !== " ") {
									color = "#f44";
									wrongLeft--;
								}

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

							wordOffset += chars.length;

							let overflowSpan = null;
							if (li === lineIdx && ti === lastWordIdx && wrongLeft > 0) {
								const overflowText = wrong.slice(-wrongLeft);
								overflowSpan = (
									<span style={{ color: "#f44" }} key="ovf">
										{overflowText}
										<span style={{ background: "rgba(200,200,255,.25)" }}> </span>
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
