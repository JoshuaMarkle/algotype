"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

import Skeleton from "@/components/ui/Skeleton";
import Navbar from "@/components/layouts/Navbar";
import AccountContent from "@/components/auth/AccountContent";
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
      <div className="flex justify-center p-4">
        <div className="w-full max-w-5xl">
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
        </div>
      </div>
    </main>
  );
}
