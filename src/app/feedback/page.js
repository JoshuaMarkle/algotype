import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import FeedbackForm from "@/components/feedback/FeedbackForm";

const ISSUES_URL = "https://github.com/JoshuaMarkle/algotype/issues/new";

export default function FeedbackPage() {
  return (
    <main>
      <Navbar />
      <div className="flex justify-center p-4 pt-16">
        <div className="w-full max-w-2xl">
          <h1 className="text-4xl my-6">Feedback</h1>
          <p className="my-4 text-fg-2">
            Found a bug, want a feature, or just have thoughts on AlgoType? Send
            it here. You don&apos;t need an account.
          </p>

          <FeedbackForm />

          <p className="mt-10 text-sm text-fg-2">
            Prefer GitHub? Open a{" "}
            <a
              href={`${ISSUES_URL}?template=bug-report.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-blue-400"
            >
              bug report
            </a>{" "}
            or a{" "}
            <a
              href={`${ISSUES_URL}?template=request-a-feature.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-blue-400"
            >
              feature request
            </a>{" "}
            issue.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export const metadata = {
  title: "Feedback | AlgoType",
  description:
    "Report a bug, request a feature or tell us what you think of AlgoType.",
};
