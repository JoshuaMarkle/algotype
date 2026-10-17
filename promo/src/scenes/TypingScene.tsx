import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { color, duration, ease, hairline, ring, role, space, VIDEO } from "../tokens";
import { storyboard } from "../storyboard";
import { fadeUp, mix, mixColor, progress, span } from "../time";
import { Backdrop } from "../components/Backdrop";
import { SectionTitle } from "../components/SectionTitle";
import { CodeEditor, EDITOR_HEADER_H, editorHeight, WindowDots } from "../components/CodeEditor";
import { Keyboard, keyboardHeight, keysFor, type KeyPaint } from "../components/Keyboard";
import { cardSurface, GamemodeCardContent } from "../components/GamemodeCard";
import { buildSnippet } from "../data/snippet";
import { buildTypingScript } from "../data/typingScript";

const { beats, copy, liveStats } = storyboard.typing;
const FLASH = 0.1; // seconds a pressed key stays lit

// The homepage's gamemode grid (sm:grid-cols-2 gap-4, cards h-48), centred
const CARD = { w: 600, h: space(48), gap: space(4) };
const GRID = {
  x: (VIDEO.width - (2 * CARD.w + CARD.gap)) / 2,
  y: (VIDEO.height - (2 * CARD.h + CARD.gap)) / 2,
};
// The editor and keyboard, stacked and centred
const EDITOR_W = 1240;
const EDITOR_FONT = 30;
const KEY_UNIT = 1.15;
const STACK_GAP = space(8);
// Where the CodeBox window sits in that stack (border box), so the picked
// card can grow into it
const EDITOR = (() => {
  const h = editorHeight(copy.lines, EDITOR_FONT);
  const stack = h + (copy.showKeyboard ? STACK_GAP + keyboardHeight(KEY_UNIT) : 0);
  return { x: (VIDEO.width - EDITOR_W) / 2, y: (VIDEO.height - stack) / 2, w: EDITOR_W, h };
})();

// The four gamemode cards come in; the picked one takes the homepage's hover
// (border-blue, scale-105, rotate-1) and grows into the editor window while
// the others fade. The editor then draws its header and code on top of it.
const ModePicker: React.FC<{ frame: number }> = ({ frame }) => {
  const enter = (i: number) => progress(frame, beats.modesIn + i * beats.modeStagger, duration.base, ease.out);
  const hover = progress(frame, beats.modeHover, 0.3, ease.out);
  const morph = span(frame, beats.morph, ease.inOut);
  const othersOut = span(frame, [beats.morph[0], beats.morph[0] + 0.35], ease.out);
  const contentOut = span(frame, [beats.morph[0], beats.morph[0] + 0.25], ease.out);
  // the window's header strip and dots arrive while it grows
  const headerIn = span(frame, [mix(beats.morph[0], beats.morph[1], 0.45), beats.morph[1]], ease.out);
  const editorIn = span(frame, beats.editorIn, ease.out);
  if (frame > beats.editorIn[1] * VIDEO.fps) return null;

  const cell = (i: number) => ({
    x: GRID.x + (i % 2) * (CARD.w + CARD.gap),
    y: GRID.y + Math.floor(i / 2) * (CARD.h + CARD.gap),
  });

  return (
    <AbsoluteFill>
      {copy.modes.map((m, i) => {
        const e = enter(i);
        const { x, y } = cell(i);
        if (i !== copy.modePick) {
          return (
            <div
              key={m.title}
              style={{
                ...cardSurface(),
                position: "absolute",
                left: x,
                top: y,
                width: CARD.w,
                height: CARD.h,
                ...fadeUp(e, 48),
                opacity: e * (1 - othersOut),
              }}
            >
              <GamemodeCardContent title={m.title} description={m.description} />
            </div>
          );
        }
        // the picked card: hover, then its box grows to the editor's
        const scale = 1 + 0.05 * hover;
        const cx = mix(x + CARD.w / 2, EDITOR.x + EDITOR.w / 2, morph);
        const cy = mix(y + CARD.h / 2, EDITOR.y + EDITOR.h / 2, morph);
        const w = mix(CARD.w * scale, EDITOR.w, morph);
        const h = mix(CARD.h * scale, EDITOR.h, morph);
        const box: React.CSSProperties = {
          position: "absolute",
          left: cx - w / 2,
          top: cy - h / 2,
          width: w,
          height: h,
          transform: `translateY(${(1 - e) * 48}px) rotate(${hover * (1 - morph)}deg)`,
          opacity: e,
        };
        return (
          <React.Fragment key={m.title}>
            {/* the CodeBox's ring, handed over to the editor as it appears */}
            <div
              style={{
                ...box,
                borderRadius: cardSurface().borderRadius,
                outline: `${ring.width}px solid ${ring.color}`,
                opacity: e * morph * (1 - editorIn),
              }}
            />
            <div style={{ ...cardSurface(mixColor(mixColor(role.border, role.accent, hover), role.border, morph)), ...box, overflow: "hidden" }}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  width: CARD.w,
                  height: CARD.h,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  opacity: 1 - contentOut,
                }}
              >
                <GamemodeCardContent title={m.title} description={m.description} />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: EDITOR_HEADER_H,
                  boxSizing: "border-box",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: space(4),
                  background: role.surfaceMuted,
                  borderBottom: `${hairline}px solid ${role.border}`,
                  opacity: headerIn,
                }}
              >
                <WindowDots />
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

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
      <ModePicker frame={frame} />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: STACK_GAP,
          opacity: 1 - out,
          transform: `scale(${mix(1, 1.035, push)})`,
        }}
      >
        {/* appears on the grown gamemode card, so it only fades */}
        <div style={{ opacity: editorIn }}>
          <CodeEditor
            lines={lines}
            typed={state.typed}
            wrong={state.wrong}
            file={copy.file}
            wpm={wpm}
            acc={acc}
            width={EDITOR_W}
            fontSize={EDITOR_FONT}
            showCursor={t >= beats.editorIn[0]}
            done={done}
          />
        </div>
        {copy.showKeyboard && (
          <div style={fadeUp(keyboardIn)}>
            <Keyboard unit={KEY_UNIT} paint={paint} />
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
