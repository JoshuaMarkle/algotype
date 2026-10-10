import { notFound } from "next/navigation";

import TimedTest from "@/components/timed/TimedTest";
import { parseTimedSlug } from "@/lib/timed";
import { langToNatural } from "@/lib/utils";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const timed = parseTimedSlug(slug);
  if (!timed) {
    return {
      title: "Timed Test Not Found | AlgoType",
      robots: { index: false },
    };
  }

  const name = `${timed.seconds} Second ${langToNatural(timed.language)}`;
  return {
    title: `${name} Typing Test | AlgoType`,
    description: `Type as much ${langToNatural(timed.language)} code as you can in ${timed.seconds} seconds on AlgoType`,
    alternates: { canonical: `https://algotype.net/timed/${slug}` },
  };
}

export default async function TimedPage({ params }) {
  const { slug } = await params;
  const timed = parseTimedSlug(slug);
  if (!timed) notFound();

  return (
    <main className="font-[family-name:var(--font-geist-sans)] flex flex-col min-h-screen p-0 md:p-4">
      <TimedTest language={timed.language} seconds={timed.seconds} />
    </main>
  );
}
