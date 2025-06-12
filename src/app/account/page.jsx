"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

import Skeleton from "@/components/ui/Skeleton";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import HashPatternSvg from "@/components/effects/HashPatternSvg";
import { supabase } from "@/lib/supabaseClient";
import Button from "@/components/ui/Button";
import ProgressGraph from "@/components/graphs/ProgressGraph";
import PastTestsTable from "@/components/tables/PastTestsTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { logout } from "@/lib/auth";
import { getUserHistory } from "@/lib/history";

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [historyData, setHistoryData] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        redirect("/login");
      }
      setUser(user);
      setLoadingUser(false);
    };

    getUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const history = await getUserHistory();
        const reversed = [...history].reverse(); // oldest to newest
        const indexed = reversed.map((d, i) => ({
          ...d,
          index: i,
        }));
        setHistoryData(indexed);
      } catch (err) {
        console.error("Failed to fetch graph data:", err.message);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchData();
  }, []);

  const stats = calculateStats(historyData);
  const languageStats = groupLanguages(historyData);

  return (
    <main>
      <Navbar />
      <div className="min-h-screen mx-4 md:mx-8 2xl:mx-16 bg-bg border-x border-border">
        <div className="flex flex-col lg:flex-row  gap-4 sm:gap-8 mx-auto w-full md:max-w-7xl pt-24 pb-16 px-4 sm:px-8">
          {/* Profile Panel */}
          <section className="lg:max-w-[30vw] xl:max-w-[20vw] flex flex-col space-y-4 border border-border rounded-sm p-8">
            <div className="flex flex-row justify-center gap-4">
              {loadingUser ? (
                <div>
                  <Skeleton className="size-24 rounded-sm" />
                </div>
              ) : (
                <Avatar className="size-24 rounded-sm">
                  <AvatarImage
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata.username}
                  />
                  <AvatarFallback className="text-6xl rounded-sm">
                    {user.user_metadata.username?.[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              <div className="truncate flex flex-col justify-between flex-1 text-left text-xl leading-tight">
                <div className="flex flex-col">
                  {loadingUser ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ) : (
                    <>
                      <h2 className="truncate">
                        {user.user_metadata.username}
                      </h2>
                      <p className="truncate text-sm text-fg-2">{user.email}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

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
            </div>

            <h3 className="font-medium mt-auto">Actions</h3>
            <div className="space-y-2">
              <Button variant="destructive" onClick={logout}>
                Logout
              </Button>
            </div>
          </section>

          {/* Main Content */}
          <div className="flex-1 grid grid-cols-1 gap-4 sm:gap-8">
            <section className="space-y-8 border border-border rounded-sm p-8">
              {historyData.length > 1 ? (
                <ProgressGraph data={historyData} loading={loadingHistory} />
              ) : (
                <div />
              )}

              <div className="grid grid-cols-3 space-x-4 space-y-8 text-center font-mono text-sm sm:text-lg">
                <StatBlock
                  label="Solved"
                  value={stats.completed}
                  sub={`/${stats.started}`}
                />
                <StatBlock label="Avg. WPM" value={stats.avgWpm} />
                <StatBlock label="Avg. ACC" value={`${stats.avgAcc}%`} />
                <StatBlock label="Started" value={stats.started} />
                <StatBlock label="Completed" value={stats.completed} />
                <StatBlock
                  label="Time Typing"
                  value={formatTime(stats.totalTime)}
                />
              </div>
            </section>

            <section className="flex-1 space-y-8 border border-border rounded-sm p-8">
              <PastTestsTable />
            </section>
          </div>
        </div>
      </div>
      <HashPatternSvg className="fixed -z-10" />
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
