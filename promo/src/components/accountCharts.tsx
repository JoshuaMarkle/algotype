// The account-statistics charts for the montage and grid, each drawn at one
// base panel size and scaled by the scene. `p` (0 → 1) draws a chart in.
import React from "react";
import { color, font, hairline, radius, role, space, text, weight } from "../tokens";
import { mixColor } from "../time";
import { storyboard, type ChartId } from "../storyboard";
import { ChartPanel } from "./ChartPanel";
import { BarChart, Distribution, HBarChart, Heatmap, LineChart, Ring } from "./charts";
import { Keyboard } from "./Keyboard";
import * as d from "../data/fake";

export const PANEL = { width: 860, height: 440 } as const;

type Size = { width: number; height: number };

// The account page's StatBlock: big mono value, fg-2 label under it
const StatBlock: React.FC<{ value: string; label: string; p: number; width: number }> = ({ value, label, p, width }) => (
  <div style={{ width, textAlign: "center", fontFamily: font.mono, opacity: p }}>
    <div style={{ fontSize: 64, lineHeight: 1.1, color: role.text }}>{value}</div>
    <div style={{ fontSize: text.sm, color: role.textMuted, marginTop: space(2) }}>{label}</div>
  </div>
);

// PastTestsTable: header in muted text, hairline rows
const RecentTable: React.FC<Size & { p: number }> = ({ width, p }) => {
  const cols = ["WPM", "Accuracy", "Language", "Slug", "Mode"];
  const widths = [0.13, 0.18, 0.2, 0.29, 0.2];
  const cell = (c: React.ReactNode, i: number, muted = false) => (
    <div
      key={i}
      style={{
        width: width * widths[i],
        padding: `${space(1)}px ${space(1)}px`,
        color: muted ? role.textMuted : role.text,
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
    >
      {c}
    </div>
  );
  return (
    <div
      style={{
        width,
        fontFamily: font.sans,
        fontSize: 21,
        border: `${hairline}px solid ${role.border}`,
        borderRadius: radius.sm,
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", borderBottom: `${hairline}px solid ${role.border}`, fontWeight: weight.medium }}>
        {cols.map((c, i) => cell(c, i, true))}
      </div>
      {d.recentTests.map((r, ri) => (
        <div
          key={ri}
          style={{
            display: "flex",
            borderBottom: ri < d.recentTests.length - 1 ? `${hairline}px solid ${role.border}` : undefined,
            opacity: Math.min(1, Math.max(0, p * 6 - ri)),
          }}
        >
          {[r.wpm, `${r.acc}`, r.language, r.slug, r.mode].map((c, i) => cell(c, i))}
        </div>
      ))}
    </div>
  );
};

const Streak: React.FC<Size & { p: number }> = ({ width, height, p }) => {
  const cell = 34;
  const gap = 10;
  const runStart = d.streakDays.length - d.streak;
  return (
    <div style={{ width, height, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ fontFamily: font.mono }}>
        <div style={{ fontSize: 150, fontWeight: weight.light, lineHeight: 1, color: role.accent }}>
          {Math.round(d.streak * p)}
        </div>
        <div style={{ fontSize: text.lg, color: role.textMuted, marginTop: space(2) }}>days in a row</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(7, ${cell}px)`, gap }}>
        {d.streakDays.map((on, i) => {
          const shown = i / d.streakDays.length < p;
          const fill = !shown || !on ? color.bg3 : i >= runStart ? role.accent : color.bg5;
          return <div key={i} style={{ width: cell, height: cell, borderRadius: 7, background: fill }} />;
        })}
      </div>
    </div>
  );
};

export const renderChart = (id: ChartId, s: Size, p: number, extra?: { heroMarker?: number }) => {
  switch (id) {
    case "wpmHistory":
      return (
        <LineChart
          {...s}
          data={d.wpmHistory}
          progress={p}
          min={50}
          max={130}
          dots
          curve="monotone"
          yLabel="WPM"
          highlight="last"
          strokeWidth={4}
          marker={
            extra?.heroMarker
              ? { index: d.wpmHistory.length - 1, label: storyboard.account.copy.heroBadge, t: extra.heroMarker }
              : undefined
          }
        />
      );
    case "averages":
      return (
        // the site's three-column grid, with room for the wider time value
        <div style={{ ...s, display: "flex", alignItems: "center" }}>
          <StatBlock width={s.width * 0.27} value={String(Math.round(d.averages.wpm * p))} label="Avg. WPM" p={Math.min(1, p * 2)} />
          <StatBlock width={s.width * 0.27} value={`${Math.round(d.averages.acc * p)}%`} label="Avg. ACC" p={Math.min(1, p * 2)} />
          <StatBlock width={s.width * 0.46} value={d.averages.time} label="Time Typing" p={Math.min(1, p * 2)} />
        </div>
      );
    case "recent":
      return <RecentTable {...s} p={p} />;
    case "bests":
      return <BarChart {...s} data={d.bestsByLanguage} progress={p} accentIndex={0} showValues />;
    case "accuracy":
      return <LineChart {...s} data={d.accuracyTrend} progress={p} min={88} max={100} curve="monotone" highlight="max" />;
    case "heatmap":
      return <Heatmap {...s} data={d.heatmapData} progress={p} />;
    case "slowKeys":
      return <HBarChart {...s} data={d.slowestKeys} progress={p} accentIndex={0} unit="ms" />;
    case "bigrams":
      return <HBarChart {...s} data={d.slowestPairs} progress={p} accentIndex={0} unit="ms" />;
    case "weekly":
      return <BarChart {...s} data={d.minutesPerWeek} progress={p} accentIndex={d.minutesPerWeek.length - 1} />;
    case "percentile":
      return <Distribution {...s} mean={60} sd={18} marker={112} range={[0, 160]} progress={p} />;
    case "rawVsNet":
      return (
        <LineChart {...s} data={d.wpmHistory} secondary={d.rawHistory} progress={p} min={50} max={140} highlight={null} fillOpacity={0} />
      );
    case "consistency":
      return <Ring {...s} value={84} progress={p} label={`${Math.round(84 * p)}%`} />;
    case "keys": {
      const max = Math.max(...Object.values(d.allTimeKeyErrors));
      return (
        <div style={{ ...s, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Keyboard
            unit={1.0}
            fontSize={15}
            paint={(k) => {
              const n = d.allTimeKeyErrors[k];
              if (!n) return undefined;
              const t = p * (0.3 + 0.7 * (n / max));
              return { fill: mixColor(role.surface, role.error, t * 0.6), border: mixColor(role.border, role.error, t), text: role.text };
            }}
          />
        </div>
      );
    }
    case "streak":
      return <Streak {...s} p={p} />;
    case "perDay":
      return <BarChart {...s} data={d.testsPerDay} progress={p} accentIndex={d.testsPerDay.length - 1} />;
    case "accByLang":
      return <HBarChart {...s} data={d.accuracyByLanguage} progress={p} accentIndex={0} unit="%" />;
  }
};

export const AccountChart: React.FC<{ id: ChartId; p: number; heroMarker?: number }> = ({ id, p, heroMarker }) => (
  <ChartPanel title={storyboard.account.charts[id]} width={PANEL.width} height={PANEL.height}>
    {(s) => renderChart(id, s, p, { heroMarker })}
  </ChartPanel>
);
