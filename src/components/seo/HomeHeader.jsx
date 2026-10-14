import Link from "next/link";

import AboutPopover from "@/components/seo/AboutPopover";
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

// Logo + "About" toggle above the quick test. The test only loads in the
// browser, so the About panel is the home page's server-rendered heading and
// copy for search engines. It sits in a collapsed <details> (still in the
// HTML, which Google indexes) so the first screen stays just the test.
// Escape or a click outside closes it
export default function HomeHeader() {
  return (
    <header className="relative z-60 flex flex-row items-center gap-4 px-4 pt-4">
      <Link href="/" className="flex flex-row items-center gap-2 font-semibold">
        <LogoMark />
        AlgoType
      </Link>
      <AboutPopover label="About">
        <div className="absolute left-4 right-4 top-full mt-2 max-w-3xl rounded-md border border-border bg-bg p-6 text-sm text-fg-3 shadow-lg">
          <h1 className="text-base font-semibold text-fg">
            Typing practice for programmers
          </h1>
          <p className="mt-2 max-w-3xl">
            AlgoType is a free code typing test. Instead of random words you
            type real code, so the brackets, operators, indentation and keywords
            you use every day become muscle memory. Every test tracks your WPM
            and accuracy, and an account keeps your history.
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

          <h2 className="mt-8 font-medium text-fg-2">
            Timed code typing tests
          </h2>
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
      </AboutPopover>
    </header>
  );
}

function LogoMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="fill-blue size-5"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.5858 5.29291C14.1953 5.68343 14.1953 6.3166 14.5858 6.70712L19.8787 12L14.5858 17.2929C14.1953 17.6834 14.1953 18.3166 14.5858 18.7071L15.2929 19.4142C15.6834 19.8048 16.3166 19.8048 16.7071 19.4142L23.0607 13.0607C23.6464 12.4749 23.6464 11.5251 23.0607 10.9394L16.7071 4.5858C16.3166 4.19528 15.6834 4.19528 15.2929 4.5858L14.5858 5.29291Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.41421 5.29291C9.80474 5.68343 9.80474 6.3166 9.41421 6.70712L4.12132 12L9.41421 17.2929C9.80474 17.6834 9.80474 18.3166 9.41421 18.7071L8.70711 19.4142C8.31658 19.8048 7.68342 19.8048 7.29289 19.4142L0.93934 13.0607C0.353553 12.4749 0.353553 11.5251 0.93934 10.9394L7.29289 4.5858C7.68342 4.19528 8.31658 4.19528 8.70711 4.5858L9.41421 5.29291Z"
      />
    </svg>
  );
}
