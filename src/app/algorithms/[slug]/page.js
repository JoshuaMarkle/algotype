import { notFound } from "next/navigation";

import TypingTest from "@/components/typing/TypingTest";
import { getChallenge, getChallengeMetadata } from "@/lib/challenges";

const MODE = "algorithms";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return getChallengeMetadata(MODE, slug, {
    // Only used when the slug does not exist (the page then 404s)
    title: "Challenge Not Found | AlgoType",
    robots: { index: false },
  });
}

export default async function AlgorithmPage({ params }) {
  const { slug } = await params;

  const challenge = await getChallenge(MODE, slug);
  if (!challenge) notFound();

  return (
    <main className="font-[family-name:var(--font-geist-sans)] flex flex-col min-h-screen p-0 md:p-4">
      <TypingTest challenge={challenge} slug={slug} />
    </main>
  );
}
