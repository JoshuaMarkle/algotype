import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import Button from "@/components/ui/Button";
import CodeBox from "@/components/ui/CodeBox";

export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="flex justify-center p-4">
        <div className="w-full max-w-5xl">
          <div className="flex flex-col items-center my-32">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-[radial-gradient(ellipse_at_50%_75%,_#fff_0%,_#ddd_60%,_#555_100%)] text-center flex flex-col lg:flex-row lg:space-x-2">
              <span>Typing Practice</span>
              <span>For Programmers</span>
            </h1>
            <p className="text-xl text-fg-2 mt-4 mb-8 px-8 text-center">
              Turn all the symbols and syntax into second nature
            </p>
            <div className="flex flex-row gap-4">
              <Button>
                Try For Free
                <ArrowRight />
              </Button>
              <Link
                href="https://github.com/JoshuaMarkle/algotype"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  Github
                </Button>
              </Link>
            </div>
          </div>

          <CodeBox />

          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center text-sm font-semibold border border-fg rounded-full my-16 px-4 h-8">
              Learn More
            </div>
          </div>

          <div className="pr-0 md:pr-[30%]">
            <h2 className="text-4xl font-semibold">What is AlgoType.net?</h2>
            <p className="text-xl text-fg-2 my-4">
              AlgoType is a platform designed to train our users typing speed,
              specifally for the purpose of programming. Many programmers can
              achieve high WPM but crash while typing code because they
              neglected to learn how to type{" "}
              <strong className="underline">real</strong> syntax.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
