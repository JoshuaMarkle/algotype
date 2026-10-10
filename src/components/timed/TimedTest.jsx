"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import TypingTest from "@/components/typing/TypingTest";
import {
  TIMED_DURATIONS,
  TIMED_LANGUAGES,
  buildTimedChallenge,
  timedSlug,
} from "@/lib/timed";
import { cn, langToNatural } from "@/lib/utils";

// Language and duration pickers live in the breadcrumb, each option is a
// link to its own /timed/<language>-<seconds> page
function Options({ options, current, href, label }) {
  return (
    <span className="flex flex-row gap-3">
      {options.map((option) => (
        <Link
          key={option}
          href={href(option)}
          className={cn(
            "text-sm font-medium transition",
            option === current
              ? "text-primary"
              : "text-muted-foreground hover:text-fg",
          )}
        >
          {label(option)}
        </Link>
      ))}
    </span>
  );
}

// Code is random, so it is generated after mount (server and client would
// generate different code). "Next" generates new code; "restart" replays
// the same code
export default function TimedTest({ language, seconds }) {
  const [challenge, setChallenge] = useState(null);
  const [round, setRound] = useState(0);

  const nextTest = useCallback(() => {
    setChallenge(buildTimedChallenge({ language, seconds }));
    setRound((r) => r + 1);
  }, [language, seconds]);

  const restart = useCallback(() => setRound((r) => r + 1), []);

  useEffect(() => nextTest(), [nextTest]);

  if (!challenge) return null;

  const nav = (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <span className="text-sm font-medium text-muted-foreground">
            Timed
          </span>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Options
            options={TIMED_LANGUAGES}
            current={language}
            href={(l) => `/timed/${timedSlug(l, seconds)}`}
            label={langToNatural}
          />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <Options
            options={TIMED_DURATIONS}
            current={seconds}
            href={(s) => `/timed/${timedSlug(language, s)}`}
            label={(s) => `${s}s`}
          />
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <TypingTest
      key={round}
      challenge={challenge}
      slug={challenge.slug}
      onNext={nextTest}
      onRestart={restart}
      nav={nav}
      timeLimit={seconds}
    />
  );
}
