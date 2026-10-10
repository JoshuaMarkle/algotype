"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Area,
  Scatter,
  Tooltip,
} from "recharts";

import Skeleton from "@/components/ui/Skeleton";
import { formatTime } from "@/lib/utils";

export default function ProgressGraph({ data, loading }) {
  if (loading) {
    return <Skeleton className="w-full h-[256px]" />;
  }

  if (data.length < 2) return <div />;

  // const sData = smoothData(data);

  return (
    <ResponsiveContainer width="100%" height={256}>
      <ComposedChart data={data}>
        <defs>
          <linearGradient id="colorToBlack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--c-blue-3)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--c-bg)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <YAxis
          stroke="var(--c-bg-3)"
          tick={{ fill: "var(--c-fg-3)", fontSize: 12 }}
          axisLine={true}
          tickLine={true}
          width={46}
          label={{
            value: "WPM",
            fill: "var(--c-fg-3)",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <XAxis
          stroke="var(--c-bg-3)"
          tick={{ fill: "var(--c-fg-3)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={46}
        />
        <Area
          type="monotone"
          dataKey="wpm"
          stroke="none"
          fill="url(#colorToBlack)"
          fillOpacity={1}
          animationDuration={1500}
          animationEasing="ease-in-out"
          isTooltipActive={false}
          activeDot={false}
        />
        <Area
          type="monotone"
          dataKey="wpm"
          stroke="var(--c-blue)"
          strokeWidth={2}
          fill="none"
          isTooltipActive={false}
          activeDot={false}
        />
        <Scatter
          data={data}
          dataKey="wpm"
          fill="var(--c-blue)"
          shape={({ cx, cy }) => (
            <circle cx={cx} cy={cy} r={3} fill="var(--c-blue)" />
          )}
          activeShape={({ cx, cy }) => (
            <circle cx={cx} cy={cy} r={4} fill="var(--c-blue)" />
          )}
        />

        <Tooltip cursor={false} content={<CustomTooltip />} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    const { wpm, acc, time } = payload[0].payload;
    return (
      <div className="bg-bg font-mono text-fg text-sm rounded-md shadow-lg px-4 py-2 space-y-1">
        <p>
          wpm: <span className="font-medium">{wpm}</span>
        </p>
        <p>
          acc: <span className="font-medium">{acc}%</span>
        </p>
        <p>
          time: <span className="font-medium">{formatTime(time)}</span>
        </p>
      </div>
    );
  }
  return null;
};
