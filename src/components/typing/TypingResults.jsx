import { AreaChart, Area, Tooltip, ResponsiveContainer } from "recharts";
import { Text, RefreshCcw, ChevronRight } from "lucide-react";

import Button from "@/components/ui/Button";
import { calculateStats } from "@/components/typing/utils/calculateStats";
import { formatTime, cleanData } from "@/lib/utils";

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
        <AreaChart data={data}>
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
        <Button variant="ghost">
          <Text className="size-4" />
        </Button>
        <Button variant="ghost">
          <RefreshCcw className="size-4" />
        </Button>
        <Button variant="ghost">
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
