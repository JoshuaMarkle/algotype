import { createSupabaseServerClient } from "@/lib/supabaseServerClient";
import { redirect } from "next/navigation";

import Navbar from "@/components/layouts/Navbar";
import AccountContent from "@/components/auth/AccountContent";

export default async function AccountPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main>
      <Navbar />
      <div className="flex justify-center p-4">
        <div className="w-full max-w-5xl">
          <AccountContent user={user} />
        </div>
      </div>
    </main>
  );
}
