import ModeIndexPage from "@/components/layouts/ModeIndexPage";

export const metadata = {
  title: "Algorithms | AlgoType",
  description:
    "Browse thousands of LeetCode-style solutions in Python, C++, Java and more, and practice typing them on AlgoType",
  alternates: { canonical: "https://algotype.net/algorithms" },
};

export default function AlgorithmsPage() {
  return (
    <ModeIndexPage
      title="Algorithms"
      description="Practice typing LeetCode-style solutions in the language of your choice"
      mode="algorithms"
    />
  );
}
