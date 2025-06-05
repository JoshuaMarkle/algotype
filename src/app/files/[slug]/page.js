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
    .eq("mode", "files")
    .single();

  if (!challenge || error) {
    return (
      <main className="p-6 text-red-500 font-mono">
        <Navbar />
        <div className="mt-6">Challenge not found or failed to load.</div>
      </main>
    );
  }

  return (
    <main className="font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <div className="flex justify-center p-4">
        <div className="w-full max-w-5xl">
          <TypingTest tokens={challenge.tokens} />
        </div>
      </div>
      <Footer />
    </main>
  );
}

export const metadata = {
  title: "Files | AlgoType",
  description: "Train your typing skills on large files",
};
