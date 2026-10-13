// Pure helpers for choosing where auth routes send the browser. Kept free of
// Next/Supabase imports so they can be unit tested.

// Only allow same-origin relative paths as redirect targets. Resolving
// against a placeholder origin catches what a prefix check misses: browsers
// read "/\evil.com" (and tab/newline variants) as "//evil.com"
const PLACEHOLDER_ORIGIN = "http://same-origin.invalid";

export function safeNext(next, fallback = "/account") {
  if (!next || !next.startsWith("/")) return fallback;

  let url;
  try {
    url = new URL(next, PLACEHOLDER_ORIGIN);
  } catch {
    return fallback;
  }
  if (url.origin !== PLACEHOLDER_ORIGIN) return fallback;

  return url.pathname + url.search + url.hash;
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

// Supabase links a GitHub/Google sign-in to an existing account with the
// same email automatically. AlgoType only links providers from Settings, so
// /auth/callback uses this to spot a provider identity that was attached to
// an older account by a plain sign-in. Returns { identity, existing } where
// `existing` lists the account's other providers, or null.
const FRESH_MS = 5 * 60 * 1000; // identity created during this sign-in
const OLDER_MS = 60 * 1000; // other identities clearly predate it

export function findAutoLinkedIdentity(user, now = Date.now()) {
  const identities = (user?.identities ?? []).filter((i) => i.created_at);
  if (identities.length < 2) return null;

  const time = (i) => new Date(i.created_at).getTime();
  const newest = identities.reduce((a, b) => (time(b) > time(a) ? b : a));
  if (newest.provider === "email") return null;
  if (now - time(newest) > FRESH_MS) return null;

  const existing = identities.filter((i) => time(newest) - time(i) > OLDER_MS);
  if (!existing.length) return null;

  return {
    identity: newest,
    existing: [...new Set(existing.map((i) => i.provider))],
  };
}

const PROVIDER_NAMES = { email: "email", github: "GitHub", google: "Google" };

export function providerName(provider) {
  return PROVIDER_NAMES[provider] ?? provider;
}

// Message shown on /login when an auto-linked sign-in was blocked
export function accountExistsMessage(provider, existing) {
  const methods = existing.map(providerName);
  const how =
    methods.length > 1
      ? `${methods.slice(0, -1).join(", ")} or ${methods.at(-1)}`
      : methods[0];
  return (
    `An account with this email already exists. Log in with ${how}, ` +
    `then link ${providerName(provider)} in Settings → Login methods.`
  );
}

// A failed password login on an account created with GitHub/Google: name the
// provider to use instead. `methods` comes from getSignInMethods(); null
// means the generic "incorrect email or password" message should stand
export function noPasswordMessage(methods) {
  if (!methods || methods.has_password) return null;
  const providers = (methods.providers ?? [])
    .filter((p) => p !== "email")
    .map(providerName);
  if (!providers.length) return null;

  const how = providers.join(" or ");
  return `This account was created with ${how} and has no password. Log in with ${how}, then add a password in Settings → Login methods.`;
}
