import Link from "next/link";
import { ArrowUpDown, ExternalLink } from "lucide-react";

import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import ProblemsTable from "@/components/tables/ProblemsTable";
import Button from "@/components/ui/Button";

export default function FilesPage() {
  return (
    <main className="relative">
      <Navbar className="fixed top" />

      {/* Files Heading */}
      <div className="mx-4 md:mx-8 2xl:mx-16 bg-bg border-x border-border">
        {/* Header */}
        <section className="relative flex flex-col pt-32 mx-auto w-full px-8 md:px-16">
          <h1 className="text-4xl md:text-5xl font-bold z-10">
            Files Files Files
          </h1>
          <p className="text-md md:text-xl text-fg-2 mt-4 mb-8 z-10">
            Practice typing features using the language of your choice
          </p>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 size-full fill-red stroke-border z-0 [mask-image:linear-gradient(to_top,_#ffffffad,_transparent)]"
          >
            <defs>
              <pattern
                id=":r1r3:"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
                x="-1"
                y="-1"
              >
                <path d="M.5 20V.5H20" fill="none" strokeDasharray="0"></path>
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              strokeWidth="0"
              fill="url(#:r1r3:)"
            ></rect>
          </svg>
        </section>

        {/* Divider */}
        <section className="relative w-full">
          <div className="-mx-4 md:-mx-8 2xl:-mx-16 flex items-center justify-center border-b border-border"></div>
        </section>

        {/* Table */}
        <section className="relative flex flex-col mx-auto w-full px-8 md:px-16 py-8">
          <ProblemsTable mode="files" />
        </section>

        {/* Background Hash */}
        <svg className="fixed pointer-events-none absolute inset-0 size-full select-none text-primary stroke-border -z-10">
          <defs>
            <pattern
              id=":r1r7:"
              width="6"
              height="4"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="4" strokeWidth="1.5"></line>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#:r1r7:)"></rect>
        </svg>
      </div>
      <Footer />
    </main>
  );
}
