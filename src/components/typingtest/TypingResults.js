import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Text, RefreshCcw, ChevronRight } from "lucide-react";
import Button from "@/components/ui/button";
import calculateStats from "./calculateStats";

export default function TypingResults({ started, stats, data }) {
  const { wpm, acc, time, timeTillWpmDrop } = calculateStats(started, stats);
  const formattedTime = formatTime(time);
  const correct = stats.current.correct;
  const incorrect = stats.current.incorrect;
  const timeLost = Math.ceil(time * (1 - acc / 100));
  const maxWPM = Math.max(...data.map((d) => d.wpm));
  const minWPM = Math.min(...data.map((d) => d.wpm));

  // Update + clean data
  if (data[data.length - 1].wpm != wpm) data.push({ wpm, acc, time });
  data = cleanData(data);

  return (
    <div className="h-[70vh] flex flex-col items-center justify-center gap-8 md:mx-32">
      <ResponsiveContainer width="100%" height={192}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorToBlack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16181b" stopOpacity={1} />
              <stop offset="100%" stopColor="#040404" stopOpacity={1} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="wpm"
            stroke="#f4f5f6"
            strokeWidth={3}
            fill="url(#colorToBlack)"
            fillOpacity={1}
            animationDuration={1500}
            animationEasing="ease-in-out"
          />
          <Tooltip cursor={false} content={<CustomTooltip />} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex flex-col sm:flex-row gap-16 md:gap-32 font-mono">
        <div>
          <h3 className="text-6xl">{wpm > 999 ? "Inf" : wpm}</h3>
          <p className="font-mono text-lg font-bold">
            WPM <span className="text-green">•</span>
            {maxWPM} <span className="text-red">•</span>
            {minWPM}
          </p>
        </div>
        <div>
          <h3 className="text-6xl">{acc}%</h3>
          <p className="font-mono text-lg font-bold">
            ACC <span className="text-green">•</span>
            {correct} <span className="text-red">•</span>
            {incorrect}
          </p>
        </div>
        <div>
          <h3 className="text-6xl">{formattedTime}</h3>
          <p className="font-mono text-lg font-bold">
            TIME <span className="text-red">•</span>
            {timeLost}
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-16 text-fg-3">
        <Button varient="ghost">
          <Text className="size-4" />
        </Button>
        <Button varient="ghost">
          <RefreshCcw className="size-4" />
        </Button>
        <Button varient="ghost">
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

// Graph tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const { wpm, acc, time } = payload[0].payload; // read from payload directly

    return (
      <div className="bg-black font-mono text-white text-sm rounded-lg shadow-lg px-4 py-2 space-y-1">
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

// Format seconds into time string
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const paddedMins = hrs > 0 ? String(mins).padStart(2, "0") : mins;
  const paddedSecs = mins > 0 || hrs > 0 ? String(secs).padStart(2, "0") : secs;

  if (hrs > 0) return `${hrs}:${paddedMins}:${paddedSecs}`;
  if (mins > 0) return `${mins}:${paddedSecs}`;
  return `${secs}s`;
}

// Thin out the data to only maxPoints points
function cleanData(data, maxPoints = 25) {
  const total = data.length;
  if (total <= maxPoints) return data;

  const step = (total - 1) / (maxPoints - 1);
  const result = [];

  for (let i = 0; i < maxPoints; i++) {
    const index = Math.round(i * step);
    result.push(data[index]);
  }

  return result;
}
