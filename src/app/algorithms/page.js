import ModeIndexPage from "@/components/layouts/ModeIndexPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "LeetCode Typing Practice | AlgoType",
  description:
    "Practice typing thousands of LeetCode solutions in Python, C++, Java and JavaScript. Pick a problem, type the real code and track your WPM and accuracy.",
  path: "/algorithms",
});

export default function AlgorithmsPage() {
  return (
    <ModeIndexPage
      title="Algorithms"
      description="Practice typing LeetCode-style solutions in the language of your choice"
      mode="algorithms"
    />
  );
}
