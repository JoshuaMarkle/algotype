import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabaseServerClient";
import { confirmRedirectPath } from "@/lib/authRedirects";

// Email links (sign-up, magic link, password reset, email change) land here
// with a token_hash. Verifying it on the server signs the user in without the
// PKCE code verifier, so links also work in another browser or on a phone.
export async function GET(request) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");
  const next = confirmRedirectPath(
    requestUrl.searchParams.get("next"),
    requestUrl.origin,
    type,
  );

  if (!tokenHash || !type) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (error) {
    console.error("Email link verification error:", error.message);
    const target = type === "recovery" ? "/login/password-reset" : "/login";
    const errorUrl = new URL(target, request.url);
    errorUrl.searchParams.set(
      "error",
      "This email link is invalid or has expired. Please request a new one.",
    );
    return NextResponse.redirect(errorUrl);
  }

  return NextResponse.redirect(new URL(next, request.url));
}
