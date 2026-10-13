import Navbar from "@/components/layouts/Navbar";
import QuickTest from "@/components/quick/QuickTest";

export const metadata = {
  alternates: { canonical: "https://algotype.net" },
};

export default function Home() {
  return (
    <main className="font-[family-name:var(--font-geist-sans)] flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-col flex-1 pt-[52px] md:px-4 md:pb-4">
        <QuickTest />
      </div>
    </main>
  );
}
