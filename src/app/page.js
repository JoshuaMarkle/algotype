import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Rocket,
  Waves,
  Earth,
  Construction,
} from "lucide-react";

import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import Button from "@/components/ui/Button";
import CodeBox from "@/components/effects/CodeBox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import HashPatternSvg from "@/components/effects/HashPatternSvg";
import RandomButton from "@/components/layouts/misc/RandomButton";

export default function Home() {
  return (
    <main className="relative">
      <Navbar className="fixed top" />

      {/* Notification */}
      <Link href="https://github.com/JoshuaMarkle/algotype" target="_blank">
        <section className="absolute top-13 flex flex-row gap-2 justify-center items-center p-2 w-full bg-fg/10 hover:bg-blue-3 transition text-sm font-mono z-10 animate-fade-down opacity-0">
          <Sparkles className="size-4" />
          Currently in <span className="font-semibold">Active</span> Development
        </section>
      </Link>

      <div className="mx-4 md:mx-8 2xl:mx-16 bg-bg border-x border-border">
        {/* Header */}
        <section className="relative flex flex-col items-center py-64">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-[radial-gradient(ellipse_at_50%_75%,_#fff_0%,_#ddd_60%,_#555_100%)] text-center flex flex-col lg:flex-row lg:space-x-2 z-10">
            <span>Typing Practice</span> <span>For Programmers</span>
          </h1>
          <p className="text-md md:text-xl text-fg-2 mt-4 mb-8 px-8 text-center z-10">
            Turn <span className="hidden lg:inline">all the symbols and</span>{" "}
            syntax into second nature
          </p>
          <div className="flex flex-row gap-4 z-10">
            <RandomButton />
            <Link
              href="https://github.com/JoshuaMarkle/algotype"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="bg-bg">
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

        {/* Main Box */}
        <section className="-mt-35 mx-auto w-full md:max-w-[1100px] overflow-hidden relative z-20">
          <div className="border border-border rounded-sm ring-8 m-2 mx-4 md:mx-8 ring-fg/10 bg-bg animate-fade-up opacity-0">
            {/* Labels*/}
            <div className="relative grid-cols-1 content-end md:grid md:grid-cols-3 grid-border border-b divide-x-0 divide-y md:divide-x md:divide-y-0 divide-border">
              <div className="flex flex-col justify-center w-full p-4 gap-2">
                <div className="flex flex-row items-center gap-2">
                  <Rocket className="size-4 text-primary" /> Intentional
                </div>
                <p className="text-fg-2">
                  Practice real-world syntax and patterns, not random words.
                </p>
              </div>
              <div className="flex flex-col justify-center w-full p-4 gap-2">
                <div className="flex flex-row items-center gap-2">
                  <Waves className="size-4 text-primary" /> Frictionless
                </div>
                <p className="text-fg-2">
                  A clean, minimal interface designed to keep you in flow.
                </p>
              </div>
              <div className="flex flex-col justify-center w-full p-4 gap-2">
                <div className="flex flex-row items-center gap-2">
                  <Earth className="size-4 text-primary" /> Expansive
                </div>
                <p className="text-fg-2">
                  Train with a growing library of algorithmic and syntax
                  challenges.
                </p>
              </div>
            </div>
            {/* Code Box*/}
            <div className="p-4">
              <CodeBox />
            </div>
          </div>
        </section>

        {/* Divider */}
        <section className="relative h-4 w-full my-16">
          <HashPatternSvg />
          <div className="-mx-4 md:-mx-8 2xl:-mx-16 h-4 flex items-center justify-center border-y border-border"></div>
        </section>

        {/* Gamemodes Header Badge */}
        <section className="flex items-center justify-center mb-16">
          <div className="flex items-center justify-center text-sm font-semibold border border-fg rounded-full px-4 h-8">
            Gamemodes
          </div>
        </section>

        {/* Gamemode Cards */}
        <section className="flex justify-center items-center mx-4 md:mx-8">
          <div className="relative flex flex-col lg:flex-row gap-8 border border-border rounded-sm ring-8 ring-fg/10 w-full md:max-w-6xl p-8">
            <div className="space-y-4 z-10">
              <h2 className="text-4xl font-bold">All the gamemodes</h2>
              <p className="text-lg text-fg-2">
                Type from a variety of different code files with over{" "}
                <span className="underline">7000</span> different typing tests
                available.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 z-10">
              <Link
                href="/algorithms"
                className="flex flex-col justify-between bg-bg-2 border border-border rounded-sm p-6 h-64 hover:border-blue hover:scale-105 hover:rotate-1 transition"
              >
                <div className="space-y-2">
                  <h3 className="text-xl">Algorithms</h3>
                  <p className="text-fg-2">
                    Practice popular algorithms and other leetcode style
                    solutions.
                  </p>
                </div>
                <ArrowRight className="size-4 ml-auto" />
              </Link>
              <Link
                href="/files"
                className="flex flex-col justify-between bg-bg-2 border border-border rounded-sm p-6 h-64 hover:border-blue hover:scale-105 hover:-rotate-1 transition"
              >
                <div className="space-y-2">
                  <h3 className="text-xl">Files</h3>
                  <p className="text-fg-2">
                    Type full implementations of real-world features & files.
                  </p>
                </div>
                <ArrowRight className="size-4 ml-auto" />
              </Link>
              <div className="flex flex-col justify-between bg-bg-2 border border-border rounded-sm p-6 h-64 hover:border-red hover:scale-105 hover:-rotate-1 transition">
                <div className="space-y-2">
                  <h3 className="text-xl">Syntax Drills</h3>
                  <p className="text-fg-2">
                    Practice certain language features like repeated for loops
                  </p>
                </div>
                <Construction className="size-4 ml-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <section className="relative h-4 w-full my-16">
          <HashPatternSvg />
          <div className="-mx-4 md:-mx-8 2xl:-mx-16 h-4 flex items-center justify-center border-y border-border"></div>
        </section>

        {/* Learn Mode Header Badge */}
        <section className="flex items-center justify-center mb-32">
          <div className="flex items-center justify-center text-sm font-semibold border border-fg rounded-full px-4 h-8">
            Learn More
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <section className="flex flex-col xl:flex-row gap-8 mx-auto w-full md:max-w-7xl pb-32 px-8">
          <h2 className="flex-1 text-4xl font-bold">
            Frequently Asked Questions
          </h2>
          <Accordion
            type="single"
            collapsible
            className="flex-2"
            defaultValue="item-1"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-2xl text-fg font-semibold pt-0">
                What is AlgoType?
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-fg-2 text-xl text-balance">
                <p>
                  AlgoType moves beyond traditional typing tests by delivering
                  targeted practice with realistic code snippets—improving both
                  speed and accuracy specifically in programming contexts.
                </p>
                <p>
                  Unlike generic typing platforms, AlgoType uses authentic code
                  examples, enabling developers to internalize syntax deeply,
                  making typing real code second nature.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-2xl text-fg font-semibold">
                Why typing syntax matters
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-fg-2 text-xl text-balance">
                <p>
                  Many developers underestimate the impact of syntax fluency.
                  High WPM in plain text doesn’t always translate to efficient
                  programming because syntax requires unique finger movements,
                  special characters, and precise formatting.
                </p>
                <p>
                  AlgoType specifically targets these overlooked aspects,
                  ensuring that syntax mastery becomes second nature, enhancing
                  productivity and reducing cognitive load while coding.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-2xl text-fg font-semibold">
                Minimalist, frictionless design
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-fg-2 text-xl text-balance">
                <p>
                  Our minimalist interface removes distractions, allowing users
                  to focus exclusively on typing. This clarity creates an ideal
                  environment for deep practice, improving retention and
                  facilitating smoother learning.
                </p>
                <p>
                  AlgoType prioritizes intuitive interactions and responsive
                  design, ensuring a seamless, interruption-free experience that
                  amplifies your ability to concentrate on mastering syntax.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-2xl text-fg font-semibold">
                Commitment to privacy
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-fg-2 text-xl text-balance">
                <p>
                  At AlgoType, your privacy and data security are paramount. We
                  minimize data collection, only gathering essential information
                  required to enhance your typing experience. Your practice
                  sessions and progress remain confidential and secure.
                </p>
                <p>
                  We are transparent about data handling, and your personal
                  details are never sold or misused. You maintain complete
                  control over your information, ensuring trust and peace of
                  mind as you sharpen your coding skills.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Background Hash */}
        <HashPatternSvg className="fixed -z-10" />
      </div>
      <Footer />
    </main>
  );
}
