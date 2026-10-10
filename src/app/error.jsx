"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCcw } from "lucide-react";

import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import Button from "@/components/ui/Button";

// Shown when a page throws while rendering (instead of a blank screen)
export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-col min-h-screen md:min-h-dvh">
      <Navbar />
      <div className="flex-1 flex justify-center items-center p-4">
        <div className="w-full max-w-5xl">
          <div className="flex flex-col items-center my-32">
            <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-[radial-gradient(ellipse_at_50%_75%,_#fff_0%,_#ddd_60%,_#555_100%)] text-center">
              Something went wrong
            </h2>
            <p className="text-xl text-fg-2 mt-4 mb-8 px-8 text-center">
              This page ran into an error. Try again, or head back home.
            </p>
            <div className="flex flex-row gap-4">
              <Button variant="outline" onClick={() => reset()}>
                Try again
                <RefreshCcw />
              </Button>
              <Link href="/">
                <Button variant="outline">
                  Go Home
                  <ArrowRight />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
