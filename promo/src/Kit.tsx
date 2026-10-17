// Component kit sheets: one composition per kit piece, for review stills.
import React from "react";
import { AbsoluteFill } from "remotion";
import { role, space, text } from "./tokens";
import { storyboard } from "./storyboard";
import { SectionTitle } from "./components/SectionTitle";
import { ChartPanel } from "./components/ChartPanel";
import { BarChart, Distribution, Heatmap, HBarChart, LineChart } from "./components/charts";
import { CodeEditor } from "./components/CodeEditor";
import { StatCounter, StatRow } from "./components/StatCounter";
import { StatusBadge } from "./components/StatusBadge";
import { SegmentedControl } from "./components/SegmentedControl";
import { buildSnippet } from "./data/snippet";
import { wpmHistory, heatmapData } from "./data/fake";

const Canvas: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: role.canvas, justifyContent: "center", alignItems: "center" }}>
    {children}
  </AbsoluteFill>
);

export const KitHeadline: React.FC = () => {
  const { copy } = storyboard.account;
  return (
    <Canvas>
      <SectionTitle title={copy.title} subtitle={copy.subtitle} start={0} />
    </Canvas>
  );
};

export const KitCharts: React.FC = () => (
  <Canvas>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, auto)", gap: space(8) }}>
      <ChartPanel title="WPM history" width={760} height={400}>
        {(s) => <LineChart {...s} data={wpmHistory} />}
      </ChartPanel>
      <ChartPanel title="Personal bests by language" width={760} height={400}>
        {(s) => (
          <BarChart
            {...s}
            showValues
            accentIndex={0}
            data={[
              { label: "Python", value: 121 },
              { label: "C++", value: 104 },
              { label: "Java", value: 98 },
              { label: "JS", value: 112 },
              { label: "Rust", value: 87 },
            ]}
          />
        )}
      </ChartPanel>
      <ChartPanel title="Practice this year" width={760} height={400}>
        {(s) => <Heatmap {...s} data={heatmapData} />}
      </ChartPanel>
      <ChartPanel title="Faster than 96% of typists" width={760} height={400}>
        {(s) => <Distribution {...s} mean={60} sd={18} marker={112} range={[0, 160]} />}
      </ChartPanel>
    </div>
  </Canvas>
);

export const KitEditor: React.FC = () => {
  const { copy, beats } = storyboard.typing;
  const { lines } = buildSnippet(copy.lines);
  return (
    <Canvas>
      <CodeEditor
        lines={lines}
        typed={beats.typo.atChar}
        wrong={beats.typo.wrong}
        breadcrumb={copy.breadcrumb}
        width={1500}
        header={<LiveStatsPreview />}
      />
    </Canvas>
  );
};

const LiveStatsPreview: React.FC = () => (
  <div style={{ display: "flex", gap: space(6), fontFamily: "Geist Mono", fontSize: text.lg }}>
    <span style={{ color: role.text }}>
      104 <span style={{ color: role.textMuted }}>wpm</span>
    </span>
    <span style={{ color: role.text }}>
      98% <span style={{ color: role.textMuted }}>acc</span>
    </span>
  </div>
);

export const KitStats: React.FC = () => {
  const { copy } = storyboard.results;
  return (
    <Canvas>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space(16) }}>
        <SegmentedControl options={storyboard.controlSwitch.copy.options} active={0.0} />
        <StatRow>
          {copy.stats.map((s) => (
            <StatCounter
              key={s.label}
              label={s.label}
              value={s.value}
              suffix={"suffix" in s ? s.suffix : ""}
              accent={"accent" in s && s.accent}
            />
          ))}
        </StatRow>
        <div style={{ display: "flex", gap: space(4), alignItems: "center" }}>
          <StatusBadge label={copy.badge} />
          <StatusBadge label="Correct" tone="correct" />
          <StatusBadge label="Error" tone="error" />
          <StatusBadge label="Python" tone="muted" />
        </div>
        <ChartPanel title={copy.keyErrorsTitle} width={760} height={340}>
          {(s) => (
            <HBarChart {...s} data={copy.keyErrors.map((k) => ({ label: k.key, value: k.count }))} />
          )}
        </ChartPanel>
      </div>
    </Canvas>
  );
};
