import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import TypingTest from "@/components/typing/TypingTest";
import { supabase } from "@/lib/supabaseClient";

export default async function FilePage({ params }) {
  const { slug } = params;

  const { data: challenge, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("slug", slug)
    .eq("mode", "algorithms")
    .single();

  if (!challenge || error) {
    return (
      <main className="p-6 text-red-500 font-mono">
        <Navbar />
        <div className="mt-6">Challenge not found or failed to load.</div>
        <Footer />
      </main>
    );
  }

  const mode = challenge.mode;
  const language = challenge.language;

  return (
    <main className="font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col justify-center max-w-5xl mx-auto py-8 px-4">
        <div className="w-full max-w-5xl">
          <TypingTest
            tokens={challenge.tokens}
            language={language}
            mode={mode}
            slug={slug}
          />
        </div>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Algorithms | AlgoType",
  description: "Train your typing skills on leetcode solutions",
};
