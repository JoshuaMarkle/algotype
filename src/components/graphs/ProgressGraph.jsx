import {
  ComposedChart,
  Area,
  Scatter,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { smoothData } from "@/lib/utils";

export default function ProgressGraph({ data }) {
  const sData = smoothData(data);
  return (
    <ResponsiveContainer width="100%" height={192}>
      <ComposedChart data={sData}>
        <defs>
          <linearGradient id="colorToBlack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16181b" stopOpacity={1} />
            <stop offset="100%" stopColor="#040404" stopOpacity={1} />
          </linearGradient>
        </defs>
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
        <Scatter
          data={data}
          dataKey="wpm"
          fill="#8a8a90"
          shape={({ cx, cy }) => (
            <circle cx={cx} cy={cy} r={3} fill="#8a8a90" />
          )}
          activeShape={({ cx, cy }) => (
            <circle cx={cx} cy={cy} r={4} fill="#ffffff" />
          )}
        />
        <Area
          type="monotone"
          dataKey="wpm"
          stroke="#f4f5f6"
          strokeWidth={2}
          fill="none"
          isTooltipActive={false}
          activeDot={false}
        />

        <Tooltip cursor={false} content={<CustomTooltip />} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

// Graph tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { wpm, acc, time } = payload[0].payload; // read from payload directly

    return (
      <div className="bg-bg font-mono text-white text-sm rounded-lg shadow-lg px-4 py-2 space-y-1">
        <p>
          wpm: <span className="font-medium">{wpm}</span>
        </p>
        <p>
          acc: <span className="font-medium">{acc}%</span>
        </p>
        {/* Optional: <p>Time: {formatTime(time)}</p> */}
      </div>
    );
  }
  return null;
};
