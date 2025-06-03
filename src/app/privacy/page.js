import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <main className="font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <div className="flex justify-center p-4">
        <div className="w-full max-w-5xl pr-0 md:pr-[20%]">
          <h1 className="text-4xl my-6">Privacy Policy</h1>
          <p className="my-4">Effective Date: May 29th, 2025</p>
          <p className="my-4">
            Your privacy is important. This Privacy Policy explains what
            information we do <strong>not</strong> collect and how your data is
            handled when you use <strong>AlgoType</strong>.
          </p>

          <h2 className="text-2xl my-4">No Personal Information Collected</h2>
          <p className="my-4">
            AlgoType does <strong>not collect</strong>, store, or process any
            personal information. You can use the site without creating an
            account, and no identifying details are required.
          </p>

          <h2 className="text-2xl my-4">No Cookies or Tracking</h2>
          <p className="my-4">
            We do <strong>not</strong> use cookies, local storage, analytics
            tools, or tracking scripts. Your activity on the site is not
            monitored or recorded.
          </p>

          <h2 className="text-2xl my-4">No Third-Party Services</h2>
          <p className="my-4">
            AlgoType does not use third-party services that collect user data
            (e.g., Google Analytics, ad networks, etc.). Everything runs locally
            in your browser.
          </p>

          <h2 className="text-2xl my-4">Data Security</h2>
          <p className="my-4">
            Since no personal data is collected, there is no user data to
            secure. Any performance data or scores are processed in real-time
            and discarded once you leave the page.
          </p>

          <h2 className="text-2xl my-4">Changes to This Policy</h2>
          <p className="my-4">
            If our practices change in the future (e.g., if we add accounts or
            analytics), we will update this Privacy Policy accordingly. Any
            changes will be clearly posted on this page.
          </p>

          <h2 className="text-2xl my-4">Contact</h2>
          <p className="my-4">
            If you have any questions about this policy, feel free to contact us
            at:{" "}
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
