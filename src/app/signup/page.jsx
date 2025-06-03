import Navbar from "@/components/navbar";
import SignupForm from "@/components/signup-form";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
