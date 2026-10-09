import { notFound } from "next/navigation";

import TypingTest from "@/components/typing/TypingTest";
import { getChallenge, getChallengeMetadata } from "@/lib/challenges";

const MODE = "algorithms";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return getChallengeMetadata(MODE, slug, {
    title: "Algorithms | AlgoType",
    description: "Train your typing skills on leetcode solutions",
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
