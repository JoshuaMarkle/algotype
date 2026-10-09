import Navbar from "@/components/layouts/Navbar";
import TypingTest from "@/components/typing/TypingTest";
import { supabase } from "@/lib/supabaseClient";

export default async function AlgorithmPage({ params }) {
  const { slug } = await params;

  // Get the test with the right slug (only returns one row)
  const { data: challenge, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!challenge || error) {
    return (
      <main className="p-8 pt-12">
        <Navbar />
        <div className="text-center text-red font-mono mt-6">
          Challenge not found or failed to load.
        </div>
      </main>
    );
  }

  return (
    <main className="font-[family-name:var(--font-geist-sans)] flex flex-col min-h-screen p-0 md:p-4">
      <TypingTest challenge={challenge} slug={slug} />
    </main>
  );
}

export const metadata = {
  title: "Algorithms | AlgoType",
  description: "Train your typing skills on leetcode solutions",
};
