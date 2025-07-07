"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

import Skeleton from "@/components/ui/Skeleton";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import HashPatternSvg from "@/components/effects/HashPatternSvg";
import Button from "@/components/ui/Button";
import ProgressGraph from "@/components/graphs/ProgressGraph";
import PastTestsTable from "@/components/tables/PastTestsTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { getUserHistory } from "@/lib/history";
import { formatIsoDate, langToNatural } from "@/lib/utils";
import { getCurrentProfile } from "@/lib/auth";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Get user + data on open
  useEffect(() => {
    const load = async () => {
      // Step 1: Get authenticated user
      const profile = await getCurrentProfile();

      if (!profile) {
        redirect("/login"); // redirect if unauthenticated
        return;
      }

      setUser(profile);
      setLoadingUser(false);

      // Step 2: Fetch history after user is verified
      try {
        const history = await getUserHistory(user); // pass user if needed
        const reversed = [...history].reverse();
        const indexed = reversed.map((d, i) => ({ ...d, index: i }));
        setHistoryData(indexed);
      } catch (err) {
        console.error("Failed to fetch graph data:", err.message);
      } finally {
        setLoadingHistory(false);
      }
    };

    load();
  }, []);

  const stats = calculateStats(historyData);
  const languageStats = groupLanguages(historyData);

  return (
    <main>
      <Navbar />
      <div className="min-h-screen mx-4 md:mx-8 bg-bg mt-16">
        {user ? (
          <div className="w-full md:max-w-7xl mx-auto pt-24 pb-16 px-4 sm:px-8 space-y-32">
            {/* Avatar + Stats */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-8">
              <section className="flex flex-col items-center lg:items-start gap-4">
                <div className="flex flex-row justify-center gap-4">
                  {loadingUser ? (
                    <div>
                      <Skeleton className="size-24 rounded-sm" />
                    </div>
                  ) : (
                    <Avatar className="size-16 rounded-sm">
                      <AvatarImage src={user.avatar_url} alt={user.username} />
                      <AvatarFallback className="text-6xl rounded-sm">
                        {user.username?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="truncate flex-1 flex flex-col justify-start text-left text-xl leading-tight">
                    <div className="flex flex-col">
                      {loadingUser ? (
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-12" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      ) : (
                        <>
                          <h2 className="truncate">{user.username}</h2>
                          <p className="truncate text-sm text-fg-2">
                            {user.email}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <p className="truncate hidden lg:block text-sm text-fg-2">
                  Joined {formatIsoDate(user.created_at)}
                </p>
              </section>
              <section className="flex-1">
                <div className="grid grid-cols-3 gap-8 text-center font-mono text-sm sm:text-lg">
                  <StatBlock label="Avg. WPM" value={stats.avgWpm} />
                  <StatBlock label="Avg. ACC" value={`${stats.avgAcc}%`} />
                  <StatBlock
                    label="Time Typing"
                    value={formatTime(stats.totalTime)}
                  />
                  <StatBlock
                    label="Solved"
                    value={stats.completed}
                    sub={`/${stats.started}`}
                  />
                  <StatBlock label="Started" value={stats.started} />
                  <StatBlock label="Completed" value={stats.completed} />
                </div>
              </section>
            </div>

            {/* Graph */}
            <section>
              {historyData.length > 1 ? (
                <ProgressGraph data={historyData} loading={loadingHistory} />
              ) : (
                <div />
              )}
            </section>

            {/* Languages */}
            {/*<section>
              {languageStats.length > 0 ? (
                <div className="flex flex-col gap-4">
                  <h3 className="font-medium">Languages</h3>
                  <div className="space-y-2">
                    {languageStats.map(({ language, count }) => (
                      <div
                        key={language}
                        className="flex flex-row justify-between text-sm capitalize"
                      >
                        <span className="text-fg-2 bg-bg-2 rounded-full py-1 px-3">
                          {langToNatural(language)}
                        </span>
                        <p>
                          {count}{" "}
                          <span className="text-fg-2">problems solved</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>Welcome to AlgoType.net!</p>
              )}
            </section>*/}

            {/* History Table */}
            <section>
              <PastTestsTable />
            </section>
          </div>
        ) : (
          <div className="mx-auto w-full md:max-w-7xl pt-24 pb-16 px-4 sm:px-8"></div>
        )}
      </div>
      <Footer />
    </main>
  );
}

function StatBlock({ label, value, sub }) {
  return (
    <div>
      <p className="text-2xl sm:text-4xl">
        {value}
        {sub && <span className="text-sm sm:text-lg text-fg-2">{sub}</span>}
      </p>
      <h4 className="text-fg-2">{label}</h4>
    </div>
  );
}

// --- Helpers ---

function calculateStats(data) {
  if (!data.length) {
    return {
      avgWpm: 0,
      avgAcc: 0,
      totalTime: 0,
      completed: 0,
      started: 0,
    };
  }

  const sum = data.reduce(
    (acc, item) => {
      acc.wpm += item.wpm || 0;
      acc.acc += item.acc || 0;
      acc.time += item.time || 0;
      acc.completed += 1;
      return acc;
    },
    { wpm: 0, acc: 0, time: 0, completed: 0 },
  );

  return {
    avgWpm: Math.round(sum.wpm / data.length),
    avgAcc: Math.round(sum.acc / data.length),
    totalTime: sum.time,
    completed: sum.completed,
    started: sum.completed,
  };
}

function groupLanguages(data) {
  const counts = {};

  for (const item of data) {
    const lang = item.language?.toLowerCase() || "unknown";
    counts[lang] = (counts[lang] || 0) + 1;
  }

  return Object.entries(counts)
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count);
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2, "0")}`;
}
