import Navbar from "@/components/layouts/Navbar";
import SignupForm from "@/components/auth/SignUpForm";
import KeyboardBackground from "@/components/effects/KeyboardBackground";

export default function SignUpPage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>
      <KeyboardBackground />
      <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm z-10">
          <SignupForm />
        </div>
      </div>
    </main>
  );
}

export const metadata = {
  title: "Sign Up | AlgoType",
  description: "Create an account to save your typing progress.",
};
