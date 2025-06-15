import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

export default function TermsPage() {
  return (
    <main>
      <Navbar />
      <div className="flex justify-center p-4 pt-16">
        <div className="w-full max-w-5xl pr-0 md:pr-[20%]">
          <h1 className="text-4xl my-6">Terms of Service</h1>
          <p className="my-4">Effective Date: June 1, 2025</p>

          <p className="my-4">
            Welcome to <strong>AlgoType</strong>, a typing test platform for
            developers. By using this site, you agree to the terms outlined
            below. If you do not agree, please do not use the service.
          </p>

          <h2 className="text-2xl my-4">Use of the Site</h2>
          <p className="my-4">
            AlgoType is provided for educational and personal improvement
            purposes. You agree not to:
          </p>
          <ul className="list-disc list-inside my-2 space-y-1">
            <li>Disrupt or interfere with the operation of the site</li>
            <li>
              Use bots, scripts, or automation to interact with the typing tests
            </li>
            <li>
              Submit malicious code or abuse the site&apos;s infrastructure
            </li>
            <li>Scrape or extract content or data for commercial purposes</li>
          </ul>

          <h2 className="text-2xl my-4">Accounts and Saved Data</h2>
          <p className="my-4">
            Users may create an account using email/password or a third-party
            provider (e.g., GitHub). Test results like WPM, accuracy, and
            performance history may be stored and associated with your account
            to track your progress.
          </p>
          <p className="my-4">
            You are responsible for maintaining the security of your account.
            You may request to delete your account or data by contacting us at{" "}
            <a href="mailto:contact@algotype.net" className="underline">
              contact@algotype.net
            </a>
            .
          </p>

          <h2 className="text-2xl my-4">Analytics</h2>
          <p className="my-4">
            We use Umami Analytics to collect anonymized data about site usage
            (e.g., visitor counts, geographic regions). This helps us improve
            the experience. No personally identifiable data is tracked through
            analytics.
          </p>

          <h2 className="text-2xl my-4">Modifications</h2>
          <p className="my-4">
            We may update these Terms at any time. Continued use of the site
            constitutes acceptance of the current version. Users are responsible
            for reviewing the Terms periodically.
          </p>

          <h2 className="text-2xl my-4">Disclaimer</h2>
          <p className="my-4">
            AlgoType is provided “as is” without warranty of any kind. We are
            not liable for data loss, account issues, or any damages arising
            from the use of this site.
          </p>

          <h2 className="text-2xl my-4">Contact</h2>
          <p className="my-4">
            For any questions, email us at{" "}
            <a href="mailto:contact@algotype.net" className="underline">
              contact@algotype.net
            </a>
            .
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}

export const metadata = {
  title: "Terms of Service | AlgoType",
  description: "Review the terms and conditions for using AlgoType.",
};
