// Hand-written SVG charts styled from the site's tokens (the recharts look
// of ProgressGraph / TypingResults: blue line, faint fill, quiet mono ticks).
// `progress` (0 → 1) draws each chart in from the left or from the base.
import React from "react";
import { color, font, role, text } from "../tokens";

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

// Line + flat area fill. Highlights one point (default: the max) in the accent.
export const LineChart: React.FC<
  Size & {
    data: number[];
    progress?: number;
    min?: number;
    max?: number;
    highlight?: number | "max" | "last" | null;
    yTicks?: boolean;
    stroke?: string;
    strokeWidth?: number;
    dots?: boolean;
  }
> = ({
  width,
  height,
  data,
  progress = 1,
  min,
  max,
  highlight = "max",
  yTicks = true,
  stroke = role.accent,
  strokeWidth = 5,
  dots = false,
}) => {
  const lo = min ?? Math.floor(Math.min(...data) * 0.9);
  const hi = max ?? Math.ceil(Math.max(...data) * 1.05);
  const axisW = yTicks ? 64 : 0;
  const padY = strokeWidth + 10;
  const w = width - axisW;
  const h = height - padY * 2;
  const x = (i: number) => axisW + (i / (data.length - 1)) * w;
  const y = (v: number) => padY + h - ((v - lo) / (hi - lo)) * h;
  const pts = data.map((v, i) => [x(i), y(v)] as const);
  const line = pts.map(([px, py], i) => `${i ? "L" : "M"}${px},${py}`).join("");
  const area = `${line}L${x(data.length - 1)},${padY + h}L${axisW},${padY + h}Z`;
  const hiIdx =
    highlight === "max"
      ? data.indexOf(Math.max(...data))
      : highlight === "last"
        ? data.length - 1
        : highlight;
  const revealX = axisW + w * progress;
  const id = `clip-${Math.round(width)}-${Math.round(height)}-${data.length}-${data[0]}`;
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <clipPath id={id}>
          <rect x={0} y={-50} width={revealX + strokeWidth} height={height + 100} />
        </clipPath>
      </defs>
      {yTicks &&
        niceTicks(lo, hi).map((t) => (
          <g key={t}>
            <line
              x1={axisW}
              x2={width}
              y1={y(t)}
              y2={y(t)}
              stroke={role.borderSubtle}
              strokeWidth={2}
            />
            <text x={axisW - 16} y={y(t) + 8} textAnchor="end" style={tickStyle}>
              {t}
            </text>
          </g>
        ))}
      <g clipPath={`url(#${id})`}>
        <path d={area} fill={stroke} opacity={0.12} />
        <path
          d={line}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {dots &&
          pts.map(([px, py], i) => (
            <circle key={i} cx={px} cy={py} r={strokeWidth} fill={stroke} />
          ))}
      </g>
      {hiIdx != null && hiIdx >= 0 && x(hiIdx) <= revealX && (
        <circle
          cx={pts[hiIdx][0]}
          cy={pts[hiIdx][1]}
          r={strokeWidth * 2.2}
          fill={role.accent}
          stroke={role.surface}
          strokeWidth={strokeWidth}
        />
      )}
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
  const labelW = 96;
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
