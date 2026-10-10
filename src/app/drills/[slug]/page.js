import { notFound } from "next/navigation";

import DrillTest from "@/components/drills/DrillTest";
import { DRILL_TYPES, parseDrillSlug } from "@/lib/drills";
import { langToNatural } from "@/lib/utils";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const drill = parseDrillSlug(slug);
  if (!drill) {
    return { title: "Drill Not Found | AlgoType", robots: { index: false } };
  }

  const names = DRILL_TYPES.filter((t) => drill.types.includes(t.id))
    .map((t) => t.name)
    .join(", ");
  const name = `${names} (${langToNatural(drill.language)})`;
  return {
    title: `${name} Drill | AlgoType`,
    description: `Practice typing ${name} syntax on AlgoType`,
    alternates: { canonical: `https://algotype.net/drills/${slug}` },
  };
}

export default async function DrillPage({ params, searchParams }) {
  const { slug } = await params;
  const { length } = await searchParams;

  const drill = parseDrillSlug(slug);
  if (!drill) notFound();

  return (
    <main className="font-[family-name:var(--font-geist-sans)] flex flex-col min-h-screen p-0 md:p-4">
      <DrillTest
        language={drill.language}
        types={drill.types}
        length={typeof length === "string" ? length : undefined}
      />
    </main>
  );
}
