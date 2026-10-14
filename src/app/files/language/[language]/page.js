import { notFound } from "next/navigation";

import LanguageIndexPage from "@/components/layouts/LanguageIndexPage";
import { getChallengeList } from "@/lib/challenges";
import { CHALLENGE_LANGUAGES, pageMetadata } from "@/lib/seo";
import { langToNatural } from "@/lib/utils";

const MODE = "files";

// Rebuilt at most once a day; challenges change only on content uploads
export const revalidate = 86400;

export async function generateMetadata({ params }) {
  const { language } = await params;
  if (!CHALLENGE_LANGUAGES.includes(language)) {
    return { title: "Not Found | AlgoType", robots: { index: false } };
  }
  const name = langToNatural(language);
  return pageMetadata({
    title: `${name} Source File Typing Practice | AlgoType`,
    description: `All source files in ${name} on AlgoType. Pick one, type the real code and track your WPM and accuracy.`,
    path: `/${MODE}/language/${language}`,
  });
}

export default async function FilesLanguagePage({ params }) {
  const { language } = await params;
  if (!CHALLENGE_LANGUAGES.includes(language)) notFound();

  const challenges = await getChallengeList(MODE, language);
  if (challenges.length === 0) notFound();

  const name = langToNatural(language);
  return (
    <LanguageIndexPage
      mode={MODE}
      title={`${name} Source File Typing Practice`}
      intro={`${challenges.length} source files in ${name}. Pick one to type it and see your WPM and accuracy.`}
      challenges={challenges}
    />
  );
}
