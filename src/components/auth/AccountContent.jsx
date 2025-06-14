"use client";

import { useEffect, useState } from "react";

import Button from "@/components/ui/Button";
import ProgressGraph from "@/components/graphs/ProgressGraph";
import PastTestsTable from "@/components/tables/PastTestsTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { logout } from "@/lib/auth";
import { getUserHistory } from "@/lib/history";
import { formatTime } from "@/lib/utils";
import { ArrowUp01 } from "lucide-react";

export default function ClientAccountPanel({ user }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user history on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const history = await getUserHistory();
        const reversed = [...history].reverse(); // oldest to newest
        const indexed = reversed.map((d, i) => ({
          ...d,
          index: i,
        }));
        setData(indexed);
      } catch (err) {
        console.error("Failed to fetch graph data:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = calculateStats(data);
  const languageStats = groupLanguages(data);

  // Optional: helper to format time from seconds to "mm:ss"
  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen mx-4 md:mx-8 2xl:mx-16 bg-bg border-x border-border">
      <div className="flex flex-col lg:flex-row  gap-4 sm:gap-8 mx-auto w-full md:max-w-7xl pt-24 pb-16 px-4 sm:px-8">
        {/* Profile */}
        <section className="lg:max-w-[30vw] xl:max-w-[20vw] flex flex-col space-y-4 border border-border rounded-sm p-8">
          <div className="flex flex-row justify-center gap-4">
            <Avatar className="size-24 rounded-sm">
              <AvatarImage
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata.username}
              />
              <AvatarFallback className="text-6xl rounded-sm">
                {user.user_metadata.username[0]}
              </AvatarFallback>
            </Avatar>
            <div className="truncate flex flex-col justify-between flex-1 text-left text-xl leading-tight">
              <div className="flex flex-col">
                <h2 className="truncate">{user.user_metadata.username}</h2>
                <p className="truncate text-sm text-fg-2">{user.email}</p>
              </div>
              {/*<div>
                <p className="truncate">
                  <span className="text-sm text-fg-2">Rank</span> 1,283
                </p>
              </div>*/}
            </div>
          </div>

          {/* Languages */}
          <h3 className="font-medium">Languages</h3>
          <div className="space-y-2">
            {languageStats.map(({ language, count }) => (
              <div
                key={language}
                className="flex flex-row justify-between text-sm capitalize"
              >
                <span className="text-fg-2 bg-bg-2 rounded-full py-1 px-3">
                  {language}
                </span>
                <p>
                  {count} <span className="text-fg-2">problems solved</span>
                </p>
              </div>
            ))}
            {/*<div className="text-center">
              <Button variant="link" className="text-fg-2 py-0">
                Load all
              </Button>
            </div>*/}
          </div>

          {/* Actions */}
          <h3 className="font-medium mt-auto">Actions</h3>
          <div className="space-y-2">
            <Button variant="destructive" onClick={logout}>
              Logout
            </Button>
          </div>
        </section>

        <div className="flex-1 grid grid-cols-1 gap-4 sm:gap-8">
          {/* Statistics */}
          <section className="space-y-8 border border-border rounded-sm p-8">
            {/* Main Graph */}
            {data.length > 1 ? (
              <ProgressGraph data={data} loading={loading} />
            ) : (
              <div />
            )}

            {/* Main Stats */}
            <div className="grid grid-cols-3 space-x-4 space-y-8 text-center font-mono text-sm sm:text-lg">
              <div>
                <p className="text-2xl sm:text-4xl">
                  {stats.completed}
                  <span className="text-sm sm:text-lg text-fg-2">
                    /{stats.started}
                  </span>
                </p>
                <h4 className="text-fg-2">Solved</h4>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl">{stats.avgWpm}</p>
                <h4 className="text-fg-2">Avg. WPM</h4>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl">{stats.avgAcc}%</p>
                <h4 className="text-fg-2">Avg. ACC</h4>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl">{stats.started}</p>
                <h4 className="text-fg-2">Started</h4>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl">{stats.completed}</p>
                <h4 className="text-fg-2">Completed</h4>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl">
                  {formatTime(stats.totalTime)}
                </p>
                <h4 className="text-fg-2">Time Typing</h4>
              </div>
            </div>
          </section>

          {/* Past Problem Table */}
          <section className="flex-1 space-y-8 border border-border rounded-sm p-8">
            <PastTestsTable />
          </section>
        </div>
      </div>
    </div>
  );
}

// Calculate stats
function calculateStats(data) {
  if (!data.length) {
    return {
      avgWpm: 0,
      avgAcc: 0,
      totalTime: 0,
      completed: 0,
      started: 0, // Adjust if you have a `completed` flag later
    };
  }

  const sum = data.reduce(
    (acc, item) => {
      acc.wpm += item.wpm || 0;
      acc.acc += item.acc || 0;
      acc.time += item.time || 0;
      acc.completed += 1; // Assuming all entries are completed
      return acc;
    },
    { wpm: 0, acc: 0, time: 0, completed: 0 },
  );

  return {
    avgWpm: Math.round(sum.wpm / data.length),
    avgAcc: Math.round(sum.acc / data.length),
    totalTime: sum.time, // In seconds
    completed: sum.completed,
    started: sum.completed, // Adjust if needed
  };
}

// Group languages together
function groupLanguages(data) {
  const aliasMap = {
    cpp: "C++",
    csharp: "C#",
    javascript: "JavaScript",
    typescript: "TypeScript",
  };

  const counts = new Map();

  for (const item of data) {
    const raw = (item.language || "unknown").toLowerCase();
    const language =
      aliasMap[raw] || raw.charAt(0).toUpperCase() + raw.slice(1);

    counts.set(language, (counts.get(language) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count);
}
