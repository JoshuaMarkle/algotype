import Navbar from "@/components/navbar";
import LoginForm from "@/components/login-form";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />
      <div className="flex flex-1 items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
