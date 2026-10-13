"use client";

import { useCallback, useEffect, useState } from "react";

import TypingTest from "@/components/typing/TypingTest";
import { getRandomChallenge } from "@/components/typing/utils/randomTest";

// Quick tests default to small LeetCode solutions
const MODE = "algorithms";
const DEFAULT_FILTERS = { language: null, minLength: null, maxLength: 50 };

// Filters are shared with TypingTest through sessionStorage["filters"]
function readFilters() {
  try {
    const stored = sessionStorage.getItem("filters");
    if (stored) return JSON.parse(stored);
    sessionStorage.setItem("filters", JSON.stringify(DEFAULT_FILTERS));
  } catch {
    /* storage unavailable - use defaults */
  }
  return DEFAULT_FILTERS;
}

// Monkeytype-style home: a random test loads right away and "next",
// Tab and the filters swap in a new one without leaving the page
export default function QuickTest() {
  const [challenge, setChallenge] = useState(null);
  const [round, setRound] = useState(0);
  const [error, setError] = useState(null);

  const loadTest = useCallback(async (filters) => {
    try {
      const next = await getRandomChallenge({ ...filters, mode: MODE });
      if (!next) {
        setError("No test matches these filters.");
        return;
      }
      setError(null);
      setChallenge(next);
      setRound((r) => r + 1);
    } catch (err) {
      console.error(err.message);
      setError("Could not load a test. Check your connection and try again.");
    }
  }, []);

  const restart = useCallback(() => setRound((r) => r + 1), []);

  useEffect(() => {
    loadTest(readFilters());
  }, [loadTest]);

  if (error && !challenge) {
    return (
      <div className="flex flex-1 items-center justify-center text-fg-2">
        {error}
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex flex-1 items-center justify-center text-fg-3 font-mono text-sm">
        Loading test...
      </div>
    );
  }

  return (
    <>
      {error && (
        <p role="status" className="text-center text-sm text-yellow pt-2">
          {error}
        </p>
      )}
      <TypingTest
        key={round}
        challenge={challenge}
        slug={challenge.slug}
        onRandom={loadTest}
        onRestart={restart}
      />
    </>
  );
}
