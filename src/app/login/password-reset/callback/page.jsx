"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";

import PasswordResetForm from "@/components/auth/PasswordResetForm";
import KeyboardBackground from "@/components/effects/KeyboardBackground";

export default function PasswordResetPage() {
  const [sessionReady, setSessionReady] = useState(false);
  const [error, setError] = useState(null);

  // Check if/when Supabase signs in
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          setSessionReady(true);
        }
      },
    );

    // If the session is already available (refresh case)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setSessionReady(true);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <main className="relative grid min-h-svh lg:grid-cols-2">
      <KeyboardBackground />
      <div className="flex flex-col gap-4 p-6 bg-bg md:p-10 border-r border-border">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <svg
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-blue size-5"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.5858 5.29291C14.1953 5.68343 14.1953 6.3166 14.5858 6.70712L19.8787 12L14.5858 17.2929C14.1953 17.6834 14.1953 18.3166 14.5858 18.7071L15.2929 19.4142C15.6834 19.8048 16.3166 19.8048 16.7071 19.4142L23.0607 13.0607C23.6464 12.4749 23.6464 11.5251 23.0607 10.9394L16.7071 4.5858C16.3166 4.19528 15.6834 4.19528 15.2929 4.5858L14.5858 5.29291Z"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.41421 5.29291C9.80474 5.68343 9.80474 6.3166 9.41421 6.70712L4.12132 12L9.41421 17.2929C9.80474 17.6834 9.80474 18.3166 9.41421 18.7071L8.70711 19.4142C8.31658 19.8048 7.68342 19.8048 7.29289 19.4142L0.93934 13.0607C0.353553 12.4749 0.353553 11.5251 0.93934 10.9394L7.29289 4.5858C7.68342 4.19528 8.31658 4.19528 8.70711 4.5858L9.41421 5.29291Z"
              />
            </svg>{" "}
            AlgoType.net
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : !sessionReady ? (
              <p className="text-center">Loading...</p>
            ) : (
              <PasswordResetForm />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
