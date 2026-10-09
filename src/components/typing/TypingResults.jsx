import Link from "next/link";
import { useState, useRef } from "react";
import { ResponsiveContainer, AreaChart, Area, Tooltip, YAxis } from "recharts";
import {
  ExternalLink,
  Image as ImageIcon,
  RefreshCcw,
  ChevronRight,
} from "lucide-react";
import html2canvas from "html2canvas";

import Button from "@/components/ui/Button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/HoverCard";
import { calculateStats } from "@/components/typing/utils/calculateStats";
import { gotoRandomTest } from "@/components/typing/utils/randomTest";
import { formatTime, cleanData } from "@/lib/utils";

export default function TypingResults({ started, ended, stats, data, source }) {
  const { wpm, acc, time } = calculateStats(started, ended, stats);
  const formattedTime = formatTime(time);
  const correct = stats.current.correct;
  const incorrect = stats.current.incorrect;
  const timeLost = Math.ceil(time * (1 - acc / 100));

  // Update + clean data
  if (data.length > 0) {
    if (data[data.length - 1].wpm != wpm) data.push({ wpm, acc, time });
    data = cleanData(data);
  }

  // Tests under 1 s have no samples, so fall back to the final WPM
  const maxWPM = data.length > 0 ? Math.max(...data.map((d) => d.wpm)) : wpm;
  const minWPM = data.length > 0 ? Math.min(...data.map((d) => d.wpm)) : wpm;

  // Screenshot
  const resultRef = useRef(null);
  const [screenshotMode, setScreenshotMode] = useState(false);
  const takeScreenshot = async () => {
    if (!resultRef.current) return;

    setScreenshotMode(true); // hide buttons + show footer
    await new Promise((res) => setTimeout(res, 100)); // wait for DOM update
    await document.fonts.ready;

    const canvas = await html2canvas(resultRef.current, {
      backgroundColor: null,
      scale: 2,
    });

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        alert("Screenshot copied to clipboard!");
      } catch (err) {
        console.error("Clipboard write failed:", err);
        alert("Failed to copy screenshot.");
      } finally {
        setScreenshotMode(false);
      }
    });
  };

  return (
    <div
      ref={resultRef}
      className="flex flex-col items-center justify-center gap-16 mx-auto px-4 flex-1 w-full max-w-5xl bg-bg"
    >
      {screenshotMode ? <div className="h-8" /> : <div />}
      <ResponsiveContainer width="100%" height={192}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorToBlack" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#315efc" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#040404" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <YAxis
            stroke="#16181b"
            tick={{ fill: "#8a8a90", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Area
            dataKey="wpm"
            stroke="#0096f5"
            strokeWidth={3}
            fill="url(#colorToBlack)"
            fillOpacity={1}
            animationDuration={0}
            animationEasing="ease-in-out"
            activeDot={{
              r: 3,
              stroke: "#0096f5",
              strokeWidth: 2,
              fill: "#0096f5",
            }}
          />
          <Tooltip cursor={false} content={<CustomTooltip />} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex flex-col sm:flex-row gap-16 md:gap-32 font-mono font-light">
        <div>
          <h3 className="text-6xl">{wpm > 999 ? "Inf" : wpm}</h3>
          <HoverCard>
            <HoverCardTrigger asChild>
              <p className="font-mono text-lg">
                WPM <span className="text-green">•</span>
                {maxWPM} <span className="text-red">•</span>
                {minWPM}
              </p>
            </HoverCardTrigger>
            <HoverCardContent className="w-40">
              <div className="flex justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="text-green">•</span> Max wpm {maxWPM}
                  </p>
                  <p className="text-sm">
                    <span className="text-red">•</span> Min wpm {minWPM}
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <div>
          <h3 className="text-6xl">{acc}%</h3>
          <HoverCard>
            <HoverCardTrigger asChild>
              <p className="font-mono text-lg">
                ACC <span className="text-green">•</span>
                {correct} <span className="text-red">•</span>
                {incorrect}
              </p>
            </HoverCardTrigger>
            <HoverCardContent className="w-40">
              <div className="flex justify-between gap-4">
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-green">•</span> Correct {correct}
                  </p>
                  <p>
                    <span className="text-red">•</span> Incorrect {incorrect}
                  </p>
                  <p>
                    <span className="text-yellow">•</span> Total{" "}
                    {correct + incorrect}
                  </p>
                  <p className="text-fg-2">
                    {correct} / {correct + incorrect} = {acc}%
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <div>
          <h3 className="text-6xl">{formattedTime}</h3>
          <HoverCard>
            <HoverCardTrigger asChild>
              <p className="font-mono text-lg">
                TIME <span className="text-red">•</span>
                {timeLost}
              </p>
            </HoverCardTrigger>
            <HoverCardContent className="w-40">
              <div className="flex justify-between gap-4">
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-red">•</span> Time lost {timeLost}s
                  </p>
                  <p className="text-fg-2">
                    {time} * (1 - {acc}%) = {timeLost}s
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
      {screenshotMode ? ( // Hide icons if screenshoting
        <p className="w-full flex flex-row justify-end text-fg-3 text-md font-mono">
          {new Date().toLocaleDateString()} | algotype.net
        </p>
      ) : (
        <div className="flex flex-row gap-16 text-fg-3">
          <Link href={source} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost">
              <ExternalLink className="size-4" />
            </Button>
          </Link>
          <Button variant="ghost" onClick={takeScreenshot}>
            <ImageIcon className="size-4" />
          </Button>
          <Button variant="ghost" onClick={() => window.location.reload()}>
            <RefreshCcw className="size-4" />
          </Button>
          <Button variant="ghost" onClick={gotoRandomTest}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
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
        {/* <p>Time: {formatTime(time)}</p> */}
      </div>
    );
  }
  return null;
};
