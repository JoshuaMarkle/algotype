import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="font-[family-name:var(--font-geist-sans)]">
      <Navbar />
      <div className="flex justify-center p-4">
        <div className="w-full max-w-5xl pr-0 md:pr-[30%]">
          <h1 className="text-4xl my-6">Terms of Service</h1>
          <p className="my-4">Effective Date: May 29th, 2025</p>
          <p className="my-4">
            Welcome to <strong>AlgoType</strong>, a free typing test tool for
            programmers. By using this website, you agree to the following Terms
            of Service. If you do not agree, please do not use the site.
          </p>
          <h2 className="text-2xl my-4">Use of the Site</h2>
          <p className="my-4">
            AlgoType is provided for educational and entertainment purposes
            only. You agree to use the site in a lawful, respectful manner and
            not to:
          </p>
          <ul>
            <li>
              Attempt to disrupt or interfere with the operation of the site.
            </li>
            <li>
              Use bots, scripts, or other automated tools to interact with the
              typing tests.
            </li>
            <li>Submit any malicious code or content.</li>
          </ul>
          <h2 className="text-2xl my-4">No User Data</h2>
          <p className="my-4">
            AlgoType does <strong>not require registration</strong> and{" "}
            <strong>does not collect any personal data</strong>. No cookies,
            accounts, or tracking systems are used.
          </p>
          <h2 className="text-2xl my-4">Changes to the Terms</h2>
          <p className="my-4">
            We may update these Terms from time to time. Your continued use of
            the site after changes are posted will constitute acceptance of
            those changes.
          </p>
          <h2 className="text-2xl my-4">Contact</h2>
          <p className="my-4">
            If you have any questions or concerns, you can contact us at:{" "}
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
