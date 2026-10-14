import QuickTest from "@/components/quick/QuickTest";
import HomeHeader from "@/components/seo/HomeHeader";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AlgoType | Typing Practice For Programmers",
  description:
    "Free typing practice for programmers. Type real code (LeetCode solutions, source files, syntax drills and timed tests in Python, C++, Java and JavaScript) and track your WPM and accuracy.",
  path: "/",
});

export default function Home() {
  return (
    <main className="font-[family-name:var(--font-geist-sans)] flex flex-col min-h-screen">
      <HomeHeader />
      <div className="flex flex-col flex-1 md:px-4 md:pb-4">
        <QuickTest />
      </div>
    </main>
  );
}
