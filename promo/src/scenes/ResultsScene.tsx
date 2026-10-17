import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { color, duration, ease, font, role, space, text } from "../tokens";
import { storyboard } from "../storyboard";
import { fadeUp, mix, mixColor, progress, span } from "../time";
import { Backdrop } from "../components/Backdrop";
import { SectionTitle } from "../components/SectionTitle";
import { LineChart } from "../components/charts";
import { ChartPanel } from "../components/ChartPanel";
import { Kbd } from "../components/Keyboard";
import { StatusBadge } from "../components/StatusBadge";
import { StatCounter } from "../components/StatCounter";

const { beats, copy, series } = storyboard.results;

const WIDTH = 1500;
const CHART_H = 250;

export const ResultsScene: React.FC = () => {
  const frame = useCurrentFrame();

  const chart = span(frame, beats.chartDraw, ease.inOut);
  const chartIn = span(frame, [beats.chartDraw[0] - 0.2, beats.chartDraw[0] + 0.4], ease.out);
  const statT = (i: number) =>
    span(frame, [beats.statsCount[0] + i * beats.statStagger, beats.statsCount[1] + i * beats.statStagger], ease.out);
  const keys = span(frame, beats.keyErrorsIn, ease.out);
  // the stack makes room for the keyboard with a calm camera move
  const lift = span(frame, [beats.keyErrorsIn[0] - 0.2, beats.keyErrorsIn[1]], ease.inOut);
  const badge = progress(frame, beats.badgeIn, duration.base, ease.out);
  const out = span(frame, beats.fadeOut, ease.inOut);

  const errors = Object.entries(copy.keyErrors);
  const maxErr = Math.max(...errors.map(([, n]) => n));

  return (
    <AbsoluteFill>
      <Backdrop />
      <SectionTitle title={copy.title} subtitle={copy.subtitle} start={beats.titleIn} exit={beats.titleOut} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: 1 - out }}>
        <div
          style={{
            width: WIDTH,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: space(8),
            transform: `translateY(${mix(150, 0, lift)}px)`,
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
          <div style={{ ...fadeUp(keys, 48), marginTop: space(4) }}>
            <ChartPanel title={copy.keyErrorsTitle} width={Math.max(480, space(12) + errors.length * 200 + (errors.length - 1) * space(6))} height={250}>
              {() => (
                <div style={{ display: "flex", gap: space(6), paddingTop: space(2) }}>
                  {errors.map(([k, n], i) => {
                    // each key settles in turn, tinted by how often it went wrong
                    const ki = span(frame, [beats.keyErrorsIn[0] + 0.15 + i * 0.08, beats.keyErrorsIn[1] + i * 0.08], ease.out);
                    const share = n / maxErr;
                    return (
                      <div key={k} style={{ display: "flex", alignItems: "center", gap: space(3) }}>
                        <Kbd label={k} tint={ki * (0.4 + 0.6 * share)} />
                        <span
                          style={{
                            fontFamily: font.mono,
                            fontSize: text.lg,
                            color: role.error,
                            opacity: ki,
                            minWidth: text.lg * 1.4,
                          }}
                        >
                          {Math.round(n * ki)}×
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </ChartPanel>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
