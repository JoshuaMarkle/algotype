import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

export default function PrivacyPolicyPage() {
  return (
    <main>
      <Navbar />
      <div className="flex justify-center p-4 pt-16">
        <div className="w-full max-w-5xl pr-0 md:pr-[20%]">
          <h1 className="text-4xl my-6">Privacy Policy</h1>
          <p className="my-4">Effective Date: June 1, 2025</p>

          <p className="my-4">
            Your privacy matters. This Privacy Policy explains what data we
            collect and how we handle it at <strong>AlgoType</strong>.
          </p>

          <h2 className="text-2xl my-4">What We Collect</h2>
          <p className="my-4">
            If you create an account, we collect your email address, username,
            and password (stored securely via Supabase). You may also sign up
            using GitHub authentication.
          </p>
          <p className="my-4">
            We store typing test results (e.g., WPM, accuracy, time) to help you
            track your progress and generate graphs over time.
          </p>

          <h2 className="text-2xl my-4">How We Use This Data</h2>
          <p className="my-4">Your data is used solely to:</p>
          <ul className="list-disc list-inside my-2 space-y-1">
            <li>Manage your account and login session</li>
            <li>Display and analyze your typing test history</li>
            <li>Improve the overall experience of the site</li>
          </ul>
          <p className="my-4">
            We do <strong>not</strong> use your data for advertising or sell it
            to third parties.
          </p>

          <h2 className="text-2xl my-4">Analytics</h2>
          <p className="my-4">
            We use Umami Analytics to understand general usage trends (e.g.,
            page views, locations, device types). This data is anonymized and
            not linked to your personal account.
          </p>

          <h2 className="text-2xl my-4">Third-Party Services</h2>
          <p className="my-4">
            We rely on Supabase for account authentication and secure storage.
            These services are subject to their own privacy and security
            standards.
          </p>

          <h2 className="text-2xl my-4">Your Rights</h2>
          <p className="my-4">
            You can request a copy of your data or delete your account by
            contacting us at:{" "}
            <a href="mailto:contact@algotype.net" className="underline">
              contact@algotype.net
            </a>
            .
          </p>

          <h2 className="text-2xl my-4">Security</h2>
          <p className="my-4">
            Passwords are hashed and stored securely using the Supabase
            authentication system. We take reasonable precautions to protect
            your data, but no system is 100% secure.
          </p>

          <h2 className="text-2xl my-4">Policy Updates</h2>
          <p className="my-4">
            This policy may change from time to time. Updates will be posted on
            this page. By continuing to use AlgoType, you agree to the current
            version of this policy.
          </p>

          <h2 className="text-2xl my-4">Contact</h2>
          <p className="my-4">
            If you have questions or requests, email us at:{" "}
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
  title: "Privacy Policy | AlgoType",
  description: "Learn how AlgoType collects and handles your data.",
};
