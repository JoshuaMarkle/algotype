// Pure helpers for choosing where auth routes send the browser. Kept free of
// Next/Supabase imports so they can be unit tested.

// Only allow same-origin relative paths as redirect targets
export function safeNext(next, fallback = "/account") {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return fallback;
  }
  return next;
}

// Where /auth/confirm goes after verifying an email link. `next` comes from
// the email template ({{ .RedirectTo }}), which is the full redirect URL the
// app passed to Supabase, so it may be absolute.
export function confirmRedirectPath(next, origin, type) {
  const fallback =
    type === "recovery" ? "/login/password-reset/callback" : "/account";
  if (!next) return fallback;

  let url;
  try {
    url = new URL(next, origin);
  } catch {
    return fallback;
  }
  if (url.origin !== origin || url.pathname === "/") return fallback;

  // Older redirect targets point at the PKCE code exchange, which has nothing
  // to exchange here; follow its own `next` instead
  if (url.pathname === "/auth/callback") {
    return safeNext(url.searchParams.get("next"), fallback);
  }

  return url.pathname + url.search + url.hash;
}
