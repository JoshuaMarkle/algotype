import { notFound } from "next/navigation";

import TypingTest from "@/components/typing/TypingTest";
import { getChallenge, getChallengeMetadata } from "@/lib/challenges";
import { decodeSlug } from "@/lib/seo";
import { langToNatural } from "@/lib/utils";

const MODE = "files";

export async function generateMetadata({ params }) {
  const slug = decodeSlug((await params).slug);
  return getChallengeMetadata(MODE, slug, {
    // Only used when the slug does not exist (the page then 404s)
    title: "Challenge Not Found | AlgoType",
    robots: { index: false },
  });
}

export default async function FilePage({ params }) {
  const slug = decodeSlug((await params).slug);

  const challenge = await getChallenge(MODE, slug);
  if (!challenge) notFound();

  return (
    <main className="font-[family-name:var(--font-geist-sans)] flex flex-col min-h-screen p-0 md:p-4">
      {/* The breadcrumb shows the title; this names the page for search and screen readers */}
      <h1 className="sr-only">
        {challenge.title} source file in {langToNatural(challenge.language)}
      </h1>
      <TypingTest challenge={challenge} slug={slug} />
    </main>
  );
}
