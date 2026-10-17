// Hand-written SVG charts styled from the site's tokens (the recharts look
// of ProgressGraph / TypingResults: blue line, faint fill, quiet mono ticks).
// `progress` (0 → 1) draws each chart in from the left or from the base.
import React from "react";
import { color, font, radius, role, space, text, weight } from "../tokens";

type Size = { width: number; height: number };

const tickStyle = {
  fontFamily: font.mono,
  fontSize: text.xs,
  fill: role.textFaint,
};

// Round ticks on a 10 / 20 / 50 grid inside [min, max]
const niceTicks = (min: number, max: number) => {
  const step = [10, 20, 50, 100].find((s) => (max - min) / s <= 4) ?? 100;
  const ticks: number[] = [];
  for (let t = Math.ceil(min / step) * step; t <= max; t += step) ticks.push(t);
  return ticks;
};

// Monotone cubic path through points (recharts' type="monotone")
const monotonePath = (pts: readonly (readonly [number, number])[]) => {
  const n = pts.length;
  if (n < 3) return pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join("");
  const dx = pts.slice(1).map((p, i) => p[0] - pts[i][0]);
  const m = pts.slice(1).map((p, i) => (p[1] - pts[i][1]) / dx[i]);
  const t = pts.map((_, i) =>
    i === 0 ? m[0] : i === n - 1 ? m[n - 2] : m[i - 1] * m[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]),
  );
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n - 1; i++) {
    const h = dx[i] / 3;
    d += `C${pts[i][0] + h},${pts[i][1] + h * t[i]} ${pts[i + 1][0] - h},${pts[i + 1][1] - h * t[i + 1]} ${pts[i + 1][0]},${pts[i + 1][1]}`;
  }
  return d;
};

// Line + flat area fill (the site's charts use a fade; the video keeps fills
// flat). Optionally a second, muted series, dots like ProgressGraph, and one
// highlighted point in the accent.
export const LineChart: React.FC<
  Size & {
    data: number[];
    secondary?: number[];
    progress?: number;
    min?: number;
    max?: number;
    highlight?: number | "max" | "last" | null;
    yTicks?: boolean;
    gridLines?: boolean;
    yLabel?: string;
    tickColor?: string;
    stroke?: string;
    strokeWidth?: number;
    fill?: string;
    fillOpacity?: number;
    dots?: boolean;
    curve?: "linear" | "monotone";
    tickSize?: number;
    // a label in the accent next to one point, faded in by `t`
    marker?: { index: number; label: string; t: number; size?: number };
  }
> = ({
  width,
  height,
  data,
  secondary,
  progress = 1,
  min,
  max,
  highlight = "max",
  yTicks = true,
  gridLines = true,
  yLabel,
  tickColor = role.textFaint,
  stroke = role.accent,
  strokeWidth = 5,
  fill,
  fillOpacity = 0.12,
  dots = false,
  curve = "linear",
  tickSize = text.xs,
  marker,
}) => {
  const all = secondary ? [...data, ...secondary] : data;
  const lo = min ?? Math.floor(Math.min(...all) * 0.9);
  const hi = max ?? Math.ceil(Math.max(...all) * 1.05);
  const axisW = yTicks ? tickSize * 2.6 + (yLabel ? tickSize * 1.6 : 0) : 0;
  const padY = strokeWidth * 2.5 + 6;
  const w = width - axisW - strokeWidth * 2;
  const h = height - padY * 2;
  const x = (i: number, n = data.length) => axisW + strokeWidth + (i / (n - 1)) * w;
  const y = (v: number) => padY + h - ((v - lo) / (hi - lo)) * h;
  const pts = data.map((v, i) => [x(i), y(v)] as const);
  const path = (p: readonly (readonly [number, number])[]) =>
    curve === "monotone" ? monotonePath(p) : p.map(([px, py], i) => `${i ? "L" : "M"}${px},${py}`).join("");
  const line = path(pts);
  const area = `${line}L${x(data.length - 1)},${padY + h}L${x(0)},${padY + h}Z`;
  const hiIdx =
    highlight === "max" ? data.indexOf(Math.max(...data)) : highlight === "last" ? data.length - 1 : highlight;
  const revealX = axisW + strokeWidth + w * progress;
  const id = `line-clip-${React.useId().replace(/:/g, "")}`;
  const ticks = { fontFamily: font.mono, fontSize: tickSize, fill: tickColor };
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={id}>
          <rect x={0} y={-50} width={revealX + strokeWidth * 2} height={height + 100} />
        </clipPath>
      </defs>
      {yTicks &&
        niceTicks(lo, hi).map((t) => (
          <g key={t}>
            {gridLines && (
              <line x1={axisW} x2={width} y1={y(t)} y2={y(t)} stroke={role.borderSubtle} strokeWidth={2} />
            )}
            <text x={axisW - tickSize * 0.6} y={y(t) + tickSize * 0.35} textAnchor="end" style={ticks}>
              {t}
            </text>
          </g>
        ))}
      {yLabel && (
        <text
          transform={`translate(${tickSize * 0.8}, ${padY + h / 2}) rotate(-90)`}
          textAnchor="middle"
          style={ticks}
        >
          {yLabel}
        </text>
      )}
      <g clipPath={`url(#${id})`}>
        <path d={area} fill={fill ?? stroke} opacity={fillOpacity} />
        {secondary && (
          <path
            d={path(secondary.map((v, i) => [x(i, secondary.length), y(v)] as const))}
            fill="none"
            stroke={color.bg5}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        <path d={line} fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round" />
        {dots && pts.map(([px, py], i) => <circle key={i} cx={px} cy={py} r={strokeWidth * 1.1} fill={stroke} />)}
      </g>
      {hiIdx != null && hiIdx >= 0 && pts[hiIdx][0] <= revealX + 0.5 && (
        <circle
          cx={pts[hiIdx][0]}
          cy={pts[hiIdx][1]}
          r={strokeWidth * 2.2}
          fill={role.accent}
          stroke={role.surface}
          strokeWidth={strokeWidth}
        />
      )}
      {marker && marker.t > 0 && (() => {
        const fs = marker.size ?? text.sm;
        const bw = marker.label.length * fs * 0.56 + fs * 1.4;
        const bh = fs * 1.9;
        const [px, py] = pts[marker.index];
        const bx = Math.min(px - bw / 2, width - bw);
        const by = py - bh - strokeWidth * 3.5 - (1 - marker.t) * 12;
        return (
          <g opacity={marker.t}>
            <rect x={bx} y={by} width={bw} height={bh} rx={radius.sm} fill={role.accent} />
            <text
              x={bx + bw / 2}
              y={by + bh / 2 + fs * 0.36}
              textAnchor="middle"
              style={{ fontFamily: font.sans, fontWeight: weight.medium, fontSize: fs, fill: role.text }}
            >
              {marker.label}
            </text>
          </g>
        );
      })()}
    </svg>
  );
};

// Vertical bars with mono labels; one bar may be the accent, the rest muted
export const BarChart: React.FC<
  Size & {
    data: { label: string; value: number }[];
    progress?: number;
    accentIndex?: number | null;
    showValues?: boolean;
  }
> = ({ width, height, data, progress = 1, accentIndex = null, showValues = false }) => {
  const labelH = text.sm * 1.6;
  const valueH = showValues ? text.sm * 1.6 : 0;
  const hi = Math.max(...data.map((d) => d.value));
  const gap = Math.min(24, (width / data.length) * 0.3);
  const bw = (width - gap * (data.length - 1)) / data.length;
  const plotH = height - labelH - valueH;
  return (
    <svg width={width} height={height}>
      {data.map((d, i) => {
        const bh = (d.value / hi) * plotH * progress;
        const bx = i * (bw + gap);
        const by = valueH + plotH - bh;
        const isAccent = i === accentIndex;
        return (
          <g key={i}>
            <rect
              x={bx}
              y={by}
              width={bw}
              height={bh}
              rx={Math.min(8, bw / 4)}
              fill={isAccent ? role.accent : color.bg4}
            />
            {showValues && (
              <text
                x={bx + bw / 2}
                y={by - 12}
                textAnchor="middle"
                style={{ ...tickStyle, fill: isAccent ? role.text : role.textMuted, opacity: progress }}
              >
                {d.value}
              </text>
            )}
            <text
              x={bx + bw / 2}
              y={height - 6}
              textAnchor="middle"
              style={{ ...tickStyle, fill: role.textMuted }}
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// Horizontal bars: label on the left, value on the right
export const HBarChart: React.FC<
  Size & {
    data: { label: string; value: number }[];
    progress?: number;
    accentIndex?: number | null;
    barColor?: string;
    unit?: string;
  }
> = ({ width, height, data, progress = 1, accentIndex = null, barColor = color.bg4, unit = "" }) => {
  // room for the longest label in the mono face (0.6em per glyph) plus a gap
  const labelW = Math.max(64, Math.max(...data.map((d) => d.label.length)) * text.sm * 0.6 + space(3));
  const valueW = 96;
  const rowH = height / data.length;
  const bh = Math.min(rowH * 0.5, 28);
  const hi = Math.max(...data.map((d) => d.value));
  const plotW = width - labelW - valueW;
  return (
    <svg width={width} height={height}>
      {data.map((d, i) => {
        const cy = rowH * i + rowH / 2;
        const bw = Math.max(bh, (d.value / hi) * plotW * progress);
        const isAccent = i === accentIndex;
        return (
          <g key={i}>
            <text
              x={0}
              y={cy + text.sm * 0.35}
              style={{ ...tickStyle, fontSize: text.sm, fill: role.text }}
            >
              {d.label}
            </text>
            <rect
              x={labelW}
              y={cy - bh / 2}
              width={bw}
              height={bh}
              rx={bh / 4}
              fill={isAccent ? role.accent : barColor}
            />
            <text
              x={width}
              y={cy + text.sm * 0.35}
              textAnchor="end"
              style={{ ...tickStyle, fontSize: text.sm, fill: role.textMuted, opacity: progress }}
            >
              {d.value}
              {unit}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// Activity heatmap: weeks × 7 days, intensity 0..4 in accent steps
export const Heatmap: React.FC<
  Size & { data: number[][]; progress?: number }
> = ({ width, height, data, progress = 1 }) => {
  const cols = data.length;
  const rows = 7;
  const gap = 6;
  const cell = Math.min(
    (width - gap * (cols - 1)) / cols,
    (height - gap * (rows - 1)) / rows,
  );
  const gridH = rows * cell + gap * (rows - 1);
  const offY = (height - gridH) / 2;
  const shown = Math.floor(cols * progress + 0.0001);
  const levels = [color.bg3, "#0b3a5e", "#0a5a92", "#0878c4", role.accent];
  return (
    <svg width={width} height={height}>
      {data.map((week, c) =>
        week.map((v, r) => (
          <rect
            key={`${c}-${r}`}
            x={c * (cell + gap)}
            y={offY + r * (cell + gap)}
            width={cell}
            height={cell}
            rx={cell * 0.2}
            fill={c < shown ? levels[v] : color.bg3}
          />
        )),
      )}
    </svg>
  );
};

// Distribution curve with one marker ("you are here") in the accent
export const Distribution: React.FC<
  Size & { mean: number; sd: number; marker: number; progress?: number; range: [number, number] }
> = ({ width, height, mean, sd, marker, progress = 1, range }) => {
  const n = 60;
  const xs = Array.from({ length: n }, (_, i) => range[0] + ((range[1] - range[0]) * i) / (n - 1));
  const pdf = (v: number) => Math.exp(-((v - mean) ** 2) / (2 * sd * sd));
  const labelH = text.xs * 2;
  const h = height - labelH;
  const x = (v: number) => ((v - range[0]) / (range[1] - range[0])) * width;
  const y = (p: number) => h - p * h * 0.92 * progress;
  const line = xs.map((v, i) => `${i ? "L" : "M"}${x(v)},${y(pdf(v))}`).join("");
  const under = xs.filter((v) => v <= marker);
  const fill =
    under.map((v, i) => `${i ? "L" : "M"}${x(v)},${y(pdf(v))}`).join("") +
    `L${x(marker)},${h}L${x(range[0])},${h}Z`;
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <path d={fill} fill={role.accent} opacity={0.18} />
      <path d={line} fill="none" stroke={color.bg5} strokeWidth={4} />
      <line x1={x(marker)} x2={x(marker)} y1={y(pdf(marker))} y2={h} stroke={role.accent} strokeWidth={4} />
      <circle cx={x(marker)} cy={y(pdf(marker))} r={10} fill={role.accent} />
      {[range[0], mean, range[1]].map((v) => (
        <text key={v} x={x(v)} y={height - 4} textAnchor="middle" style={tickStyle}>
          {v}
        </text>
      ))}
    </svg>
  );
};

// Ring with a big number in the middle
export const Ring: React.FC<
  Size & { value: number; progress?: number; label: string }
> = ({ width, height, value, progress = 1, label }) => {
  const r = Math.min(width, height) / 2 - 14;
  const c = 2 * Math.PI * r;
  const cx = width / 2;
  const cy = height / 2;
  return (
    <svg width={width} height={height}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color.bg3} strokeWidth={20} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={role.accent}
        strokeWidth={20}
        strokeLinecap="round"
        strokeDasharray={`${c * (value / 100) * progress} ${c}`}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
      <text
        x={cx}
        y={cy + r * 0.12}
        textAnchor="middle"
        style={{ fontFamily: font.mono, fontWeight: 300, fontSize: r * 0.5, fill: role.text }}
      >
        {label}
      </text>
    </svg>
  );
};
