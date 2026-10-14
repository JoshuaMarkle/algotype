import Link from "next/link";

import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { challengePath } from "@/lib/seo";

// Server-rendered list of every challenge in one mode + language. The
// searchable tables load in the browser, so without these pages crawlers
// found challenge pages only through the sitemap (Ahrefs: "orphan page")
export default function LanguageIndexPage({ title, intro, mode, challenges }) {
  return (
    <main className="relative">
      <Navbar className="fixed top" />

      <div className="mx-4 md:mx-8 2xl:mx-16 bg-bg border-x border-border min-h-screen">
        <section className="flex flex-col pt-32 mx-auto w-full px-8 md:px-16">
          <Link
            href={`/${mode}`}
            className="text-sm text-fg-3 hover:text-fg transition"
          >
            ← All {mode}
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mt-4">{title}</h1>
          <p className="text-md md:text-xl text-fg-2 mt-4 mb-8 max-w-3xl">
            {intro}
          </p>
        </section>

        <section className="border-t border-border mx-auto w-full px-8 md:px-16 py-8 pb-32">
          <ul className="columns-1 sm:columns-2 lg:columns-3 gap-8 text-sm">
            {challenges.map((c) => (
              <li key={c.slug} className="break-inside-avoid py-1">
                <Link
                  href={challengePath(mode, c.slug)}
                  prefetch={false}
                  className="text-fg-2 hover:text-blue-400 transition"
                >
                  {c.title}
                </Link>{" "}
                <span className="text-fg-3">· {c.lines} lines</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <Footer />
    </main>
  );
}
