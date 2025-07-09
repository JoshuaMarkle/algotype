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
            <stop offset="0%" stopColor="#315efc" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#040404" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <YAxis
          stroke="#16181b"
          tick={{ fill: "#5a5a5f", fontSize: 12 }}
          axisLine={true}
          tickLine={true}
          width={46}
          label={{
            value: "WPM",
            fill: "#5a5a5f",
            angle: -90,
            position: "insideLeft",
            style: { textAnchor: "middle" },
          }}
        />
        <XAxis
          stroke="#16181b"
          tick={{ fill: "#5a5a5f", fontSize: 12 }}
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
          stroke="#0096f5"
          strokeWidth={2}
          fill="none"
          isTooltipActive={false}
          activeDot={false}
        />
        <Scatter
          data={data}
          dataKey="wpm"
          fill="#0096f5"
          shape={({ cx, cy }) => (
            <circle cx={cx} cy={cy} r={3} fill="#0096f5" />
          )}
          activeShape={({ cx, cy }) => (
            <circle cx={cx} cy={cy} r={4} fill="#0096f5" />
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
      <div className="bg-bg font-mono text-white text-sm rounded-md shadow-lg px-4 py-2 space-y-1">
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
