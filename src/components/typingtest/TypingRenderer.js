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
  lastWordIdx,
}) {
  return (
    <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
      {tokens.map((line, li) => {
        let wordOffset = 0;
        let wrongLeft = li === lineIdx ? wrong.length : 0;

        return (
          <div key={`line-${li}`} className="flex flex-row">
            <div className="text-fg-3 mr-4">{li}</div>
            {line.map((token, ti) => {
              const showCursor = true;
              const isPast = li < lineIdx || (li === lineIdx && ti < tokenIdx);
              const isFuture = !(cursorTokenIndices.has(ti) && li === lineIdx);
              const tokenTypeClass = `token-${token.type ?? "plain"}`;

              // Hide newline if in past/future
              if (token.type === "newline" && (isPast || isFuture)) {
                const isCursorHere = li === lineIdx && ti === tokenIdx;
                if (!isCursorHere) return null; // Skip rendering
              }

              // Past tokens
              if (isPast) {
                return (
                  <span
                    key={`${li}-${ti}`}
                    className={`token ${tokenTypeClass}`}
                  >
                    {token.content}
                  </span>
                );
              }

              // Future tokens (past current word)
              if (isFuture) {
                if (tokenTypeClass === "token-comment") {
                  return (
                    <span key={`${li}-${ti}`} className="token token-disabled">
                      {token.content}
                    </span>
                  );
                } else {
                  return (
                    <span key={`${li}-${ti}`} className="token">
                      {token.content}
                    </span>
                  );
                }
              }

              // Current token (render each character)
              const chars = token.content.split("");
              const rendered = chars.map((ch, charIdx) => {
                const globalPos = wordOffset + charIdx;
                const cursorHere =
                  showCursor && globalPos === typed + wrong.length;

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
