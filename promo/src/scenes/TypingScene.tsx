import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { color, ease, role, space, VIDEO } from "../tokens";
import { storyboard } from "../storyboard";
import { fadeUp, mix, mixColor, span } from "../time";
import { Backdrop } from "../components/Backdrop";
import { SectionTitle } from "../components/SectionTitle";
import { CodeEditor } from "../components/CodeEditor";
import { Keyboard, keysFor, type KeyPaint } from "../components/Keyboard";
import { buildSnippet } from "../data/snippet";
import { buildTypingScript } from "../data/typingScript";

const { beats, copy, liveStats } = storyboard.typing;
const FLASH = 0.1; // seconds a pressed key stays lit

export const TypingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / VIDEO.fps;

  const { lines } = useMemo(() => buildSnippet(copy.lines), []);
  const script = useMemo(
    () => buildTypingScript(lines, { start: beats.typingStart, end: beats.typingEnd, typo: beats.typo }),
    [lines],
  );
  const state = script.at(t);

  // Live stats refresh every 0.5 s, like the CodeBox demo
  const tick = Math.floor((t - beats.typingStart) / 0.5);
  const i = Math.max(0, Math.min(liveStats.wpm.length - 1, tick));
  const wpm = t < beats.typingStart ? 0 : liveStats.wpm[i];
  const acc = t < beats.typingStart ? 100 : liveStats.acc[i];

  // Keys lit by the most recent presses
  const lit = new Map<string, { age: number; error: boolean }>();
  for (let e = script.events.length - 1; e >= 0; e--) {
    const ev = script.events[e];
    if (ev.t > t) continue;
    const age = t - ev.t;
    if (age > FLASH) break;
    for (const k of keysFor(ev.key)) if (!lit.has(k)) lit.set(k, { age, error: ev.error });
  }
  const paint = (label: string): KeyPaint | undefined => {
    const l = lit.get(label);
    if (!l) return undefined;
    const strength = 1 - l.age / FLASH;
    const hue = l.error ? role.error : role.accent;
    return {
      fill: mixColor(role.surface, hue, strength),
      border: mixColor(role.border, hue, strength),
      text: mixColor(color.fg3, role.text, strength),
    };
  };

  const editorIn = span(frame, beats.editorIn, ease.out);
  const keyboardIn = span(frame, beats.keyboardIn, ease.out);
  const push = span(frame, beats.cameraPush, ease.inOut);
  const out = span(frame, beats.fadeOut, ease.inOut);
  // the demo's pause button turns into restart once the last key lands
  const done = span(frame, [beats.typingEnd + 0.15, beats.typingEnd + 0.45], ease.inOut);

  return (
    <AbsoluteFill>
      <Backdrop />
      <SectionTitle title={copy.title} subtitle={copy.subtitle} start={beats.titleIn} exit={beats.titleOut} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: space(8),
          opacity: 1 - out,
          transform: `scale(${mix(1, 1.035, push)})`,
        }}
      >
        <div style={fadeUp(editorIn)}>
          <CodeEditor
            lines={lines}
            typed={state.typed}
            wrong={state.wrong}
            file={copy.file}
            wpm={wpm}
            acc={acc}
            width={1240}
            fontSize={30}
            showCursor={t >= beats.editorIn[0]}
            done={done}
          />
        </div>
        {copy.showKeyboard && (
          <div style={fadeUp(keyboardIn)}>
            <Keyboard unit={1.15} paint={paint} />
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
