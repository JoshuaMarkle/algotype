"use client";

import "@/app/globals.css";

// Last-resort fallback when the root layout itself fails
export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <main className="flex flex-col min-h-screen justify-center items-center gap-4 p-4 text-center">
          <h2 className="text-4xl font-bold">Something went wrong</h2>
          <p className="text-fg-2">
            AlgoType ran into an error loading this page.
          </p>
          <button
            className="border border-border rounded-md px-4 py-2 hover:bg-bg-2"
            onClick={() => reset()}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
