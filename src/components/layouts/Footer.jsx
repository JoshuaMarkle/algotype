import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg px-4 py-16">
      {/* ─────────── Top section (row on md+, column on sm) ─────────── */}
      <div className="mx-auto flex max-w-5xl flex-col gap-8 md:flex-row items-center md:items-start">
        {/* Brand + description */}
        <div className="flex flex-col gap-2 md:flex-1">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
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
            </svg>{" "}
            AlgoType
          </Link>
          <p className="text-fg-2">The typing website for programmers</p>
        </div>

        {/* Links: stay horizontal as a row, each group vertical */}
        <nav className="flex flex-row flex-wrap gap-12 text-fg-2">
          <div className="flex flex-col gap-2">
            <Link
              href="/algorithms"
              className="transition-colors hover:text-blue-400"
            >
              Algorithms
            </Link>
            <Link
              href="/files"
              className="transition-colors hover:text-blue-400"
            >
              Files
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <Link
              href="/terms"
              className="transition-colors hover:text-blue-400"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="transition-colors hover:text-blue-400"
            >
              Privacy Policy
            </Link>
          </div>
        </nav>
      </div>

      {/* ───────────── Bottom copyright (always centered) ───────────── */}
      <p className="mt-12 text-center text-sm text-fg-2">© AlgoType 2025</p>
    </footer>
  );
}
