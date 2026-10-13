import QuickTest from "@/components/quick/QuickTest";

export const metadata = {
  alternates: { canonical: "https://algotype.net" },
};

export default function Home() {
  return (
    <main className="font-[family-name:var(--font-geist-sans)] flex flex-col min-h-screen">
      <div className="flex flex-col flex-1 md:px-4 md:pb-4">
        <QuickTest />
      </div>
    </main>
  );
}
