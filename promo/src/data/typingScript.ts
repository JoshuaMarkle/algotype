// A deterministic typist for the typing scene, after the site's CodeBox demo:
// steady keystrokes with a little jitter, a short pause between words, one
// typo of a few wrong keys, a pause, then backspaces. Returns the editor
// state at any time.
import { random } from "remotion";
import type { Ch } from "./snippet";

export type KeyEvent = {
  t: number; // seconds, scene-local
  typed: number; // correct keystrokes so far
  wrong: number; // wrong keys pending
  key: string; // the key pressed (for the keyboard), "" for none
  error: boolean; // this press was wrong
};

type Opts = {
  start: number;
  end: number;
  typo: { atKey: number; keys: string; pause: number; backspaceEvery: number };
};

export const buildTypingScript = (lines: Ch[][], { start, end, typo }: Opts) => {
  const chars = lines.flat().filter((c) => c.key !== null);
  const total = chars.length;

  // Relative weight of the gap before each correct keystroke
  const weights = chars.map((c, i) => {
    const prev = chars[i - 1];
    const wordGap = prev && (prev.ch === " " || prev.newline) ? 1.4 : 0;
    return 1 + random(`gap-${i}`) * 0.6 + wordGap;
  });
  const typoFixed = typo.pause + typo.keys.length * typo.backspaceEvery;
  const typoKeysWeight = typo.keys.length * 1.2;
  const sumW = weights.reduce((a, b) => a + b, 0) + typoKeysWeight;
  const unit = (end - start - typoFixed) / sumW;

  const events: KeyEvent[] = [];
  let t = start;
  let typed = 0;
  for (let i = 0; i < total; i++) {
    if (i === typo.atKey) {
      for (let w = 0; w < typo.keys.length; w++) {
        t += unit * 1.2;
        events.push({ t, typed, wrong: w + 1, key: typo.keys[w], error: true });
      }
      t += typo.pause;
      for (let b = typo.keys.length - 1; b >= 0; b--) {
        t += typo.backspaceEvery;
        events.push({ t, typed, wrong: b, key: "Backspace", error: false });
      }
    }
    t += unit * weights[i];
    typed++;
    const c = chars[i];
    events.push({ t, typed, wrong: 0, key: c.newline ? "\n" : c.ch, error: false });
  }

  // State at time `s`: the last event at or before it
  const at = (s: number) => {
    let lo = 0;
    let hi = events.length - 1;
    let found = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (events[mid].t <= s) {
        found = mid;
        lo = mid + 1;
      } else hi = mid - 1;
    }
    if (found < 0) return { typed: 0, wrong: 0, last: null as KeyEvent | null };
    const e = events[found];
    return { typed: e.typed, wrong: e.wrong, last: e };
  };

  return { events, total, at, typoKeys: typo.keys };
};
