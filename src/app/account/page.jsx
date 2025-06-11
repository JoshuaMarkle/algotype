"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

import Skeleton from "@/components/ui/Skeleton";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import AccountContent from "@/components/auth/AccountContent";
import HashPatternSvg from "@/components/effects/HashPatternSvg";
import { supabase } from "@/lib/supabaseClient";

export default function AccountPage() {
  // Immediately get user data
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        redirect("/login");
      }
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, []);

  return (
    <main>
      <Navbar />

      {loading ? (
        <>
          <div className="flex flex-row gap-8 justify-center items-center mt-12">
            <Skeleton className="size-16 rounded-full" />
            <div className="flex-1">
              <Skeleton className="truncate h-6 w-64" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mt-8" />
          <Skeleton className="h-4 w-[70%] mt-4" />
        </>
      ) : (
        <AccountContent user={user} />
      )}

      {/* Background Hash */}
      <HashPatternSvg className="-z-10" />
      <Footer />
    </main>
  );
}
