// The typing-test snippet: the site's own Prism-tokenized quicksort
// (src/data/quicksort.json), flattened to characters the way the site's
// TypingRenderer walks them. Leading indentation is auto-skipped, the
// newline is one keystroke.
import quicksort from "./quicksort.json";

export type Ch = {
  ch: string;
  type: string;
  // index in the sequence of keystrokes; null for auto-skipped indentation
  key: number | null;
  newline?: boolean;
};

type Token = { type: string; content: string; skip?: boolean };

export const buildSnippet = (lineCount: number) => {
  const src = (quicksort.tokens as Token[][]).slice(0, lineCount);
  let key = 0;
  const lines: Ch[][] = src.map((line, li) => {
    const out: Ch[] = [];
    line.forEach((tok) => {
      if (tok.type === "newline") {
        // the last line has nothing to press Enter into
        if (li < src.length - 1) out.push({ ch: "↵", type: "newline", key: key++, newline: true });
        return;
      }
      for (const ch of tok.content) {
        out.push({ ch, type: tok.type, key: tok.skip ? null : key++ });
      }
    });
    return out;
  });
  return { lines, keystrokes: key, language: quicksort.language, title: quicksort.title };
};
