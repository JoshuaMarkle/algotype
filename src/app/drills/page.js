import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import DrillPicker from "@/components/drills/DrillPicker";

export const metadata = {
  title: "Syntax Drills | AlgoType",
  description:
    "Short, repeated typing drills for loops, functions, conditionals, classes and common idioms in Python, C++ and Java",
  alternates: { canonical: "https://algotype.net/drills" },
};

export default function DrillsPage() {
  return (
    <main className="relative">
      <Navbar className="fixed top" />

      <div className="mx-4 md:mx-8 2xl:mx-16 bg-bg border-x border-border">
        {/* Header */}
        <section className="relative flex flex-col pt-32 mx-auto w-full px-8 md:px-16">
          <h1 className="text-4xl md:text-5xl font-bold z-10">Syntax Drills</h1>
          <p className="text-md md:text-xl text-fg-2 mt-4 mb-8 z-10">
            Short, repeated snippets of the syntax you want to get faster at
          </p>
        </section>

        {/* Divider */}
        <section className="relative w-full">
          <div className="-mx-4 md:-mx-8 2xl:-mx-16 flex items-center justify-center border-b border-border"></div>
        </section>

        {/* Picker */}
        <section className="relative flex flex-col mx-auto w-full px-8 md:px-16 py-8 pb-32">
          <DrillPicker />
        </section>
      </div>
      <Footer />
    </main>
  );
}
