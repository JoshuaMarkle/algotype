import Navbar from "@/components/layouts/Navbar";
import TypingTest from "@/components/typing/TypingTest";
import { supabase } from "@/lib/supabaseClient";

export default async function FilePage({ params }) {
  const { slug } = await params;

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

  return (
    <main className="font-[family-name:var(--font-geist-sans)] flex flex-col min-h-screen p-0 md:p-4">
      <TypingTest challenge={challenge} slug={slug} />
    </main>
  );
}

export const metadata = {
  title: "Files | AlgoType",
  description: "Train your typing skills on large files",
};
