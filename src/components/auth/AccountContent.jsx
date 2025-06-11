"use client";

import Button from "@/components/ui/Button";
import ProgressGraph from "@/components/graphs/ProgressGraph";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { logout } from "@/lib/auth";

const rawData = Array.from({ length: 100 }, (_, i) => {
  const baseWPM = 60 + i * 1; // Gradual increase from 60
  const variation = (Math.random() - 0.5) * 120; // ±15 variation
  const wpm = Math.round(baseWPM + variation);

  const acc = parseFloat((0.85 + Math.random() * 0.14).toFixed(2)); // 0.85–0.99

  return { wpm, acc };
});
const data = rawData.map((d, i) => ({ ...d, index: i }));

export default function ClientAccountPanel({ user }) {
  return (
    <div className="min-h-screen mx-4 md:mx-8 2xl:mx-16 bg-bg border-x border-border">
      <div className="flex flex-col lg:flex-row  gap-4 sm:gap-8 mx-auto w-full md:max-w-7xl pt-24 pb-16 px-4 sm:px-8">
        {/* Profile */}
        <section className="flex flex-col space-y-4 border border-border rounded-sm p-8">
          <div className="flex flex-row justify-center gap-4">
            <Avatar className="size-24 rounded-sm">
              <AvatarImage
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata.full_name}
              />
              <AvatarFallback>{user.user_metadata.full_name[0]}</AvatarFallback>
            </Avatar>
            <div className="truncate flex flex-col justify-between flex-1 text-left text-xl leading-tight">
              <div className="flex flex-col">
                <h2 className="truncate">{user.user_metadata.full_name}</h2>
                <p className="truncate text-sm text-fg-2">{user.email}</p>
              </div>
              <div>
                <p className="truncate">
                  <span className="text-sm text-fg-2">Rank</span> 1,283
                </p>
              </div>
            </div>
          </div>

          {/* Languages */}
          <h3 className="font-medium">Languages</h3>
          <div className="space-y-2">
            <div className="flex flex-row justify-between text-sm">
              <span className="text-fg-2 bg-bg-2 rounded-full py-1 px-3">
                Python
              </span>
              <p>
                XX <span className="text-fg-2">problems solved</span>
              </p>
            </div>
            <div className="flex flex-row justify-between text-sm">
              <span className="text-fg-2 bg-bg-2 rounded-full py-1 px-3">
                C++
              </span>
              <p>
                XX <span className="text-fg-2">problems solved</span>
              </p>
            </div>
            <div className="flex flex-row justify-between text-sm">
              <span className="text-fg-2 bg-bg-2 rounded-full py-1 px-3">
                JavaScript
              </span>
              <p>
                XX <span className="text-fg-2">problems solved</span>
              </p>
            </div>
            <div className="text-center">
              <Button variant="link" className="text-fg-2 py-0">
                Load all
              </Button>
            </div>
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
            <ProgressGraph data={data} />

            {/* Main Stats */}
            <div className="grid grid-cols-3 space-x-4 space-y-8 text-center font-mono text-sm sm:text-lg">
              <div>
                <p className="text-2xl sm:text-4xl">
                  99<span className="text-sm sm:text-lg text-fg-2">/123</span>
                </p>
                <h4 className="text-fg-2">Solved</h4>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl">123</p>
                <h4 className="text-fg-2">Avg. WPM</h4>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl">95%</p>
                <h4 className="text-fg-2">Avg. ACC</h4>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl">1234</p>
                <h4 className="text-fg-2">Started</h4>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl">123</p>
                <h4 className="text-fg-2">Completed</h4>
              </div>
              <div>
                <p className="text-2xl sm:text-4xl">12:34</p>
                <h4 className="text-fg-2">Time Typing</h4>
              </div>
            </div>
          </section>

          {/* Past Problem Table */}
          <section className="flex-1 space-y-8 border border-border rounded-sm p-8"></section>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Account | AlgoType",
  description: "View stats and track your progress",
};
