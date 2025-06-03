import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TypingTest from "@/components/typingtest/TypingTest";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const { data, error } = await supabase
    .from("challenges")
    .select("slug")
    .eq("mode", "files");

  if (error || !data) return [];

  return data.map((row) => ({ slug: row.slug }));
}

export default async function FileChallengePage({ params }) {
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
