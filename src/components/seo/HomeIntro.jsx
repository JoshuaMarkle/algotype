import Link from "next/link";

import { TIMED_LANGUAGES, timedSlug } from "@/lib/timed";
import { langToNatural } from "@/lib/utils";

const MODES = [
  {
    href: "/algorithms",
    name: "LeetCode solutions",
    text: "Thousands of real algorithm solutions in Python, C++, Java and JavaScript.",
  },
  {
    href: "/files",
    name: "Source files",
    text: "Full files and feature implementations, the way code looks at work.",
  },
  {
    href: "/drills",
    name: "Syntax drills",
    text: "Short, repeated loops, functions, classes and idioms until they are automatic.",
  },
];

// Server-rendered text below the quick test. The test itself only loads in
// the browser, so without this the home page had no heading or copy for
// search engines to read. Styled like a quiet footer so the first screen
// stays just the test
export default function HomeIntro() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto w-full max-w-5xl px-8 py-12 text-sm text-fg-3">
        <h1 className="text-base font-semibold text-fg-2">
          Typing practice for programmers
        </h1>
        <p className="mt-2 max-w-3xl">
          AlgoType is a free code typing test. Instead of random words you type
          real code, so the brackets, operators, indentation and keywords you
          use every day become muscle memory. Every test tracks your WPM and
          accuracy, and an account keeps your history.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {MODES.map((mode) => (
            <div key={mode.href}>
              <h2 className="font-medium text-fg-2">
                <Link
                  href={mode.href}
                  className="hover:text-blue-400 transition"
                >
                  {mode.name}
                </Link>
              </h2>
              <p className="mt-1">{mode.text}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-8 font-medium text-fg-2">Timed code typing tests</h2>
        <p className="mt-1">
          {TIMED_LANGUAGES.map((language, i) => (
            <span key={language}>
              {i > 0 && " · "}
              <Link
                href={`/timed/${timedSlug(language, 30)}`}
                className="hover:text-blue-400 transition"
              >
                {langToNatural(language)} typing test
              </Link>
            </span>
          ))}
          {" · "}
          <Link href="/homepage" className="hover:text-blue-400 transition">
            About AlgoType
          </Link>
        </p>
      </div>
    </section>
  );
}
