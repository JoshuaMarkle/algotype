import { useMemo } from "react";

export default function useTokenNormalizer(tokens) {
  return useMemo(() => {
    if (!Array.isArray(tokens)) return [];

    const lines = tokens.tokens ?? tokens;
    const out = [];

    lines.forEach((line, idx) => {
      if (!line.tokens || line.tokens.length === 0) {
        out.push({
          content: "\n",
          newline: true,
          autoSkip: true,
          color: "#666",
        });
        return;
      }

      line.tokens.forEach((token) => {
        out.push({ ...token, newline: false });
      });

      if (idx !== lines.length - 1) {
        out.push({
          content: "\n",
          newline: true,
          autoSkip: line.skip,
          color: "#666",
        });
      }
    });

    return out;
  }, [tokens]);
}
