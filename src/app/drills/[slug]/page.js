import { notFound } from "next/navigation";

import DrillTest from "@/components/drills/DrillTest";
import { DRILL_TYPES, parseDrillSlug } from "@/lib/drills";
import { langToNatural } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";

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
  return pageMetadata({
    title: `${name} Typing Drill | AlgoType`,
    description: `Practice typing ${name} syntax with short, repeated code drills on AlgoType, typing practice for programmers.`,
    path: `/drills/${slug}`,
  });
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
