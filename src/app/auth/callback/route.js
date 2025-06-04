// src/app/auth/callback/route.js

import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key) => cookies().get(key)?.value,
        set: (key, value, options) => cookies().set(key, value, options),
        remove: (key) => cookies().delete(key),
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Session exchange error:", error.message);
    return NextResponse.redirect(new URL("/login?error=auth", request.url));
  }

  return NextResponse.redirect(new URL("/", request.url));
}
