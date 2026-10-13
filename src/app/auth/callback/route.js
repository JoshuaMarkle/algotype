import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabaseServerClient";
import {
  accountExistsMessage,
  findAutoLinkedIdentity,
  safeNext,
} from "@/lib/authRedirects";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextParam = requestUrl.searchParams.get("next");
  const next = safeNext(nextParam);
  // Flows that set `next` (linking a provider from /settings) show their own
  // errors; sign-in flows show them on /login
  const errorPage = safeNext(nextParam, "/login");

  // Supabase sends errors back as query params (e.g. expired link)
  const authError =
    requestUrl.searchParams.get("error_description") ||
    requestUrl.searchParams.get("error");
  if (authError) {
    const errorUrl = new URL(errorPage, request.url);
    errorUrl.searchParams.set("error", authError);
    return NextResponse.redirect(errorUrl);
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Session exchange error:", error.message);
    const errorUrl = new URL(errorPage, request.url);
    errorUrl.searchParams.set(
      "error",
      "Your sign-in link is invalid or has expired. Please try again.",
    );
    return NextResponse.redirect(errorUrl);
  }

  // Sign-in flows (no `next`) must not attach a provider to an existing
  // account; providers are linked from Settings only
  if (!nextParam) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const linked = findAutoLinkedIdentity(user);

    if (linked) {
      const { error: unlinkError } = await supabase.auth.unlinkIdentity(
        linked.identity,
      );
      if (unlinkError) {
        console.error("Could not undo provider link:", unlinkError.message);
      }
      await supabase.auth.signOut();

      const errorUrl = new URL("/login", request.url);
      errorUrl.searchParams.set(
        "error",
        accountExistsMessage(linked.identity.provider, linked.existing),
      );
      return NextResponse.redirect(errorUrl);
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
