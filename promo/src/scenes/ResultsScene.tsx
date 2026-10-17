import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { color, duration, ease, font, role, space, text, VIDEO, weight } from "../tokens";
import { storyboard } from "../storyboard";
import { fadeUp, mix, mixColor, progress, span } from "../time";
import { Backdrop, KeyboardBackground } from "../components/Backdrop";
import { SectionTitle } from "../components/SectionTitle";
import { LineChart } from "../components/charts";
import { Keyboard } from "../components/Keyboard";
import { StatusBadge } from "../components/StatusBadge";
import { StatCounter } from "../components/StatCounter";

const { beats, copy, series } = storyboard.results;

const WIDTH = 1500;
const CHART_H = 220;
// the typing scene's keyboard, a little larger so the error keys read
const KEY_UNIT = 1.55;
// While the keyboard arrives the camera pulls back a little and the stack
// rises from "chart + numbers centred" to "everything centred"
const PULL_BACK = 0.9;
const LIFT = 243;

export const ResultsScene: React.FC = () => {
  const frame = useCurrentFrame();

  const chart = span(frame, beats.chartDraw, ease.inOut);
  const chartIn = span(frame, [beats.chartDraw[0] - 0.2, beats.chartDraw[0] + 0.4], ease.out);
  const statT = (i: number) =>
    span(frame, [beats.statsCount[0] + i * beats.statStagger, beats.statsCount[1] + i * beats.statStagger], ease.out);
  const keys = span(frame, beats.keyErrorsIn, ease.out);
  // the stack makes room for the keyboard with a calm camera move
  const lift = span(frame, [beats.keyErrorsIn[0] - 0.2, beats.keyErrorsIn[1]], ease.inOut);
  // each error key settles in turn, tinted by how often it went wrong
  const errorKey = (k: string) => {
    const keys = Object.keys(copy.keyErrors);
    const i = keys.indexOf(k);
    return span(frame, [beats.keyErrorsIn[0] + 0.25 + i * 0.12, beats.keyErrorsIn[1] + 0.1 + i * 0.12], ease.out);
  };
  const badge = progress(frame, beats.badgeIn, duration.base, ease.out);
  const out = span(frame, beats.fadeOut, ease.inOut);

  const errors: Record<string, number> = copy.keyErrors;
  const maxErr = Math.max(...Object.values(errors));

  return (
    <AbsoluteFill>
      <Backdrop />
      {/* the title sits on the login page's drifting keyboards */}
      <KeyboardBackground
        clearCentre
        t={frame / VIDEO.fps}
        opacity={span(frame, beats.keysBgIn, ease.out) * (1 - span(frame, beats.titleOut, ease.inOut))}
      />
      <SectionTitle title={copy.title} subtitle={copy.subtitle} start={beats.titleIn} exit={beats.titleOut} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: 1 - out }}>
        <div
          style={{
            width: WIDTH,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: space(8),
            transform: `translateY(${mix(LIFT, -14, lift)}px) scale(${mix(1, PULL_BACK, lift)})`,
          }}
        >
          <div style={{ opacity: chartIn }}>
            <LineChart
              width={WIDTH}
              height={CHART_H}
              data={[...series]}
              progress={chart}
              min={50}
              max={130}
              highlight={null}
              gridLines={false}
              tickColor={role.textMuted}
              tickSize={text.sm}
              strokeWidth={6}
              fill={color.blue3}
              fillOpacity={0.16}
            />
          </div>
          <div style={{ width: WIDTH, display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: space(6) }}>
            <StatCounter
              value={copy.wpm.value}
              label="WPM"
              dots={[copy.wpm.max, copy.wpm.min]}
              t={statT(0)}
              valueColor={mixColor(role.text, role.accent, badge)}
              badge={
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: "100%",
                    marginBottom: space(4),
                    ...fadeUp(badge, 16),
                  }}
                >
                  <StatusBadge label={copy.badge} />
                </div>
              }
            />
            <StatCounter value={copy.raw.value} label="RAW" t={statT(1)} />
            <StatCounter
              value={copy.acc.value}
              suffix="%"
              label="ACC"
              dots={[copy.acc.correct, copy.acc.incorrect]}
              t={statT(2)}
            />
            <StatCounter value={copy.consistency.value} suffix="%" label="CONSISTENCY" t={statT(3)} />
          </div>
          <div style={{ ...fadeUp(keys, 48), marginTop: space(2) }}>
            <div
              style={{
                fontFamily: font.sans,
                fontSize: text.base,
                fontWeight: weight.medium,
                color: role.text,
                marginBottom: space(3),
              }}
            >
              {copy.keyErrorsTitle}
            </div>
            <Keyboard
              unit={KEY_UNIT}
              fontSize={15}
              badgeScale={1.5}
              paint={(k) => {
                const n = errors[k];
                if (!n) return undefined;
                const t = errorKey(k) * (0.45 + 0.55 * (n / maxErr));
                return {
                  fill: mixColor(role.surface, role.error, t * 0.45),
                  border: mixColor(role.border, role.error, t),
                  text: role.text,
                  badge: String(n),
                  badgeOpacity: errorKey(k),
                };
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
