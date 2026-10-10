"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb";
import TypingTest from "@/components/typing/TypingTest";
import { buildDrillChallenge, drillLength } from "@/lib/drills";
import { langToNatural } from "@/lib/utils";

// A drill is random, so it is generated after mount (server and client
// would generate different code). "Next" generates a new drill; "restart"
// replays the same one
export default function DrillTest({ language, types, length }) {
  const count = drillLength(length).count;
  const [challenge, setChallenge] = useState(null);
  const [round, setRound] = useState(0);

  const nextDrill = useCallback(() => {
    setChallenge(buildDrillChallenge({ language, types, count }));
    setRound((r) => r + 1);
  }, [language, types, count]);

  const restart = useCallback(() => setRound((r) => r + 1), []);

  useEffect(() => nextDrill(), [nextDrill]);

  if (!challenge) return null;

  const nav = (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link
            href="/drills"
            className="text-sm font-medium text-muted-foreground hover:text-fg transition"
          >
            Drills
          </Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <span className="text-sm font-medium text-muted-foreground">
            {langToNatural(language)}
          </span>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{challenge.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <TypingTest
      key={round}
      challenge={challenge}
      slug={challenge.slug}
      onNext={nextDrill}
      onRestart={restart}
      nav={nav}
    />
  );
}
