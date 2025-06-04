// src/app/account/page.jsx

import { createSupabaseServerClient } from "@/lib/supabaseServerClient";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar";
import ClientAccountPanel from "./ClientAccountPanel"; // ⬅️ new client component

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
      <ClientAccountPanel user={user} />
    </main>
  );
}
