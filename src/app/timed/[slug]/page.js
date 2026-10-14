import { notFound } from "next/navigation";

import TimedTest from "@/components/timed/TimedTest";
import { parseTimedSlug } from "@/lib/timed";
import { langToNatural } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";

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
  return pageMetadata({
    title: `${name} Code Typing Test | AlgoType`,
    description: `Free ${timed.seconds} second ${langToNatural(timed.language)} code typing test. Type as much real ${langToNatural(timed.language)} code as you can and see your WPM and accuracy.`,
    path: `/timed/${slug}`,
  });
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
