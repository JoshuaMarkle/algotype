import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { color, ease, VIDEO } from "../tokens";
import { storyboard, type ChartId } from "../storyboard";
import { mix, progress, span } from "../time";
import { Backdrop } from "../components/Backdrop";
import { SectionTitle } from "../components/SectionTitle";
import { KineticHeadline } from "../components/KineticHeadline";
import { AccountChart, PANEL } from "../components/accountCharts";
import { PlacedControl } from "./ControlSwitchScene";

const { beats, copy, grid, hero, montage } = storyboard.account;

// Timeline, derived from the beats
const cutStarts = beats.montageCuts.reduce<number[]>(
  (acc, len, i) => [...acc, i === 0 ? beats.montageStart : acc[i - 1] + beats.montageCuts[i - 1]],
  [],
);
const montageEnd = beats.montageStart + beats.montageCuts.reduce((a, b) => a + b, 0);
const burstEnd = montageEnd + beats.burst;
const zoomStart = burstEnd + beats.gridHold;
const zoomEnd = zoomStart + beats.zoom;
const fadeStart = storyboard.account.length - beats.fadeToWhite;

// 4×4 grid: panels at half size, 24px gaps, centred in the frame
const GRID_SCALE = 0.5;
const GAP = 24;
const cellW = PANEL.width * GRID_SCALE;
const cellH = PANEL.height * GRID_SCALE;
const gridX0 = (VIDEO.width - (cellW * 4 + GAP * 3)) / 2;
const gridY0 = (VIDEO.height - (cellH * 4 + GAP * 3)) / 2;
const cellCentre = (i: number) => ({
  x: gridX0 + (i % 4) * (cellW + GAP) + cellW / 2,
  y: gridY0 + Math.floor(i / 4) * (cellH + GAP) + cellH / 2,
});

// Where the hero lands after the zoom: wide, above the headline
const HERO_W = 1440;
const HERO_ZOOM = HERO_W / cellW;
const HERO_TARGET = { x: VIDEO.width / 2, y: 90 + (cellH * HERO_ZOOM) / 2 };

const centre = { x: VIDEO.width / 2, y: VIDEO.height / 2 };

export const AccountScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / VIDEO.fps;

  const titleOut = span(frame, beats.titleOut, ease.inOut);

  // --- Montage: one chart at a time, shrinking toward the centre as cuts speed up
  const inMontage = t >= beats.montageStart && t < montageEnd;
  const cut = cutStarts.findLastIndex((s) => t >= s);
  const montageU = Math.min(1, Math.max(0, (t - beats.montageStart) / (montageEnd - beats.montageStart)));
  const montageScale = mix(beats.montageScale[0], beats.montageScale[1], ease.inOut(montageU));

  // --- Burst into the grid, hold, zoom into the hero
  const burst = span(frame, [montageEnd, burstEnd], ease.out);
  const zoom = span(frame, [zoomStart, zoomEnd], ease.inOut);
  const heroCentre = cellCentre(grid.indexOf(hero));
  const z = Math.exp(mix(0, Math.log(HERO_ZOOM), zoom));
  const cam = { x: mix(centre.x, heroCentre.x, zoom), y: mix(centre.y, heroCentre.y, zoom) };
  const screen = { x: mix(centre.x, HERO_TARGET.x, zoom), y: mix(centre.y, HERO_TARGET.y, zoom) };
  // the rest of the grid dims away as the camera arrives
  const others = 1 - zoom;

  const headlineStart = zoomEnd + beats.headlineAfterZoom;
  const marker = progress(frame, zoomEnd + beats.badgeAfterZoom, 0.5, ease.out);
  const white = span(frame, [fadeStart, storyboard.account.length], ease.inOut);

  // draw-in of a chart that appears at `start` (montage cut), quick and calm
  const drawIn = (start: number, len: number) => progress(frame, start, Math.min(0.6, len), ease.out);

  const panel = (id: ChartId, x: number, y: number, scale: number, p: number, opacity = 1, key?: string) => (
    <div
      key={key ?? id}
      style={{
        position: "absolute",
        left: x - PANEL.width / 2,
        top: y - PANEL.height / 2,
        width: PANEL.width,
        height: PANEL.height,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <AccountChart id={id} p={p} heroMarker={id === hero ? marker : undefined} />
    </div>
  );

  // grid order with the last montage chart drawn on top during the burst
  const lastMontage = montage[montage.length - 1];
  const gridOrder = [...grid].sort((a, b) => (a === lastMontage ? 1 : 0) - (b === lastMontage ? 1 : 0));

  return (
    <AbsoluteFill>
      <Backdrop />
      <PlacedControl active={1} opacity={1 - titleOut} />
      <SectionTitle title={copy.title} subtitle={copy.subtitle} start={beats.titleIn} exit={beats.titleOut} />

      {inMontage && cut >= 0 && panel(montage[cut], centre.x, centre.y, montageScale, drawIn(cutStarts[cut], beats.montageCuts[cut]))}

      {t >= montageEnd && (
        <AbsoluteFill
          style={{
            transformOrigin: "0 0",
            transform: `translate(${screen.x - z * cam.x}px, ${screen.y - z * cam.y}px) scale(${z})`,
          }}
        >
          {gridOrder.map((id) => {
            const target = cellCentre(grid.indexOf(id));
            const x = mix(centre.x, target.x, burst);
            const y = mix(centre.y, target.y, burst);
            const s = mix(beats.montageScale[1], GRID_SCALE, burst);
            // charts that were not in the montage arrive already drawn
            return panel(id, x, y, s, 1, id === hero ? 1 : others, id);
          })}
        </AbsoluteFill>
      )}

      {t >= headlineStart - 0.1 && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 96 }}>
          <KineticHeadline text={copy.hero} start={headlineStart} size={88} />
        </AbsoluteFill>
      )}

      <AbsoluteFill style={{ background: color.white, opacity: white }} />
    </AbsoluteFill>
  );
};
