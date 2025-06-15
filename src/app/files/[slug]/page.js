import Navbar from "@/components/layouts/Navbar";
import TypingTest from "@/components/typing/TypingTest";
import { supabase } from "@/lib/supabaseClient";

export default async function FilePage({ params }) {
  const { slug } = params;

  const { data: challenge, error } = await supabase
    .from("challenges")
    .select("*")
    .eq("slug", slug)
    .eq("mode", "files")
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

  const mode = challenge.mode;
  const language = challenge.language;

  return (
    <main className="font-[family-name:var(--font-geist-sans)]">
      <div className="max-w-5xl mx-auto py-16 px-4">
        <TypingTest
          tokens={challenge.tokens}
          language={language}
          mode={mode}
          slug={slug}
        />
      </div>
    </main>
  );
}

export const metadata = {
  title: "Files | AlgoType",
  description: "Train your typing skills on large files",
};
