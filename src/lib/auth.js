import { supabase } from "@/lib/supabaseClient";
import { clearHistoryCache } from "@/lib/history";

// --- Email/Password ---

export async function signupWithEmail(username, email, password) {
  // Check if username within constraints
  username = username.trim();
  if (username.length <= 3) throw new Error("Username is too short");
  if (username.length > 20) throw new Error("Username is too long");

  // Check if the username is already taken
  const existing = await isUsernameFree(username);
  if (!existing) throw new Error("Username already taken");

  // Create the new user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: { username },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function loginWithEmail(email, password) {
  clearUserCaches();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

// --- Providers ---
// signInWithOAuth navigates the browser to the provider itself, so callers
// must not redirect afterwards (that would cancel the OAuth navigation).

async function loginWithProvider(provider) {
  clearUserCaches();
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function loginWithGitHub() {
  return loginWithProvider("github");
}

export async function loginWithGoogle() {
  return loginWithProvider("google");
}

// --- Magic Link ---

export async function loginWithMagicLink(email) {
  if (!email) throw new Error("Enter your email address first");

  clearUserCaches();
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      shouldCreateUser: false,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function resendVerificationEmail(email) {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
}

// --- Linking Providers ---
// Requires "Manual linking" to be enabled in Supabase Auth settings.

export async function linkProvider(provider) {
  const { data, error } = await supabase.auth.linkIdentity({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  clearProfileCache();
  return data;
}

export async function unlinkProvider(provider) {
  const { data, error } = await supabase.auth.getUserIdentities();
  if (error) throw new Error(error.message);

  const identities = data?.identities ?? [];
  if (identities.length <= 1) {
    throw new Error("Cannot remove the only login method.");
  }

  const identity = identities.find((i) => i.provider === provider);
  if (!identity) throw new Error(`No ${provider} login is linked.`);

  const { error: unlinkError } = await supabase.auth.unlinkIdentity(identity);
  if (unlinkError) throw new Error(unlinkError.message);

  clearProfileCache();
  return true;
}

// --- Password Management ---

export async function addPasswordToUser(email, password) {
  const { data, error } = await supabase.auth.updateUser({ email, password });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function requestPasswordReset(email) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login/password-reset/callback`,
  });

  if (error) throw new Error(error.message);
  return data;
}

// --- Helpers ---

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  // if (error) throw new Error(error.message); // Ignore errors (just not logged in)
  if (error) return null;
  return data.user;
}

export async function getCurrentProfile(forceRefresh = false) {
  // Session is read locally (no network), so it is cheap to check that the
  // cached profile still belongs to the signed-in user
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    clearUserCaches();
    return null;
  }

  if (!forceRefresh) {
    const cached = readProfileCache();
    if (cached?.id === session.user.id) return cached;
  }

  // Get user (network, validates the session)
  const authUser = await getCurrentUser(); // returns null if not signed in
  if (!authUser) {
    clearUserCaches();
    return null;
  }

  // A different user signed in since the caches were written
  const cached = readProfileCache();
  if (cached && cached.id !== authUser.id) clearUserCaches();

  // Get user profile (network)
  const { data: row, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .maybeSingle();

  if (error) console.error("Failed to load user profile:", error.message);
  if (!row) {
    // The users row is created by a DB trigger; fall back to auth data so the
    // UI keeps working if that row is missing
    console.warn("No users row for signed-in user", authUser.id);
  }

  // Merge and cache
  const meta = authUser.user_metadata ?? {};
  const profile = {
    ...row,
    id: authUser.id,
    username:
      row?.username ??
      meta.username ??
      meta.user_name ??
      meta.full_name ??
      authUser.email?.split("@")[0] ??
      null,
    email: authUser.email,
    avatar_url: authUser.user_metadata?.avatar_url ?? null,
    created_at: authUser.created_at,
    providers: authUser.app_metadata?.providers ?? null,
  };

  if (row) cacheProfile(profile);
  return profile;
}

export async function isUsernameFree(username) {
  const { data, error } = await supabase.rpc("is_username_available", {
    _name: username,
  });

  if (error) {
    console.error("Error details:", error);
    throw error;
  }
  return data;
}

export async function isEmailFree(email) {
  const { data, error } = await supabase.rpc("is_email_available", {
    _email: email,
  });

  if (error) throw error;
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) console.error("Error during sign-out:", error.message);

  clearUserCaches();
  window.location.reload();
}

export async function deleteAccount() {
  const confirmed = window.confirm(
    "This will permanently delete your AlgoType account and all your typing history. This action cannot be undone.\n\n" +
      "Do you want to continue?",
  );
  if (!confirmed) return;

  // Call the RPC function (deletes current user)
  const { error } = await supabase.rpc("delete_account");

  if (error) {
    alert("Could not delete account:\n\n" + error.message);
    return;
  }

  alert("Account deleted successfully");
  await logout();
}

// --- Cache User ---

const PROFILE_KEY = "algotype_profile";
const TTL_MS = 1000 * 60 * 15; // 15-minute freshness window

function cacheProfile(profile) {
  const payload = { profile, ts: Date.now() };
  localStorage.setItem(PROFILE_KEY, JSON.stringify(payload));
}

function readProfileCache() {
  const raw = localStorage.getItem(PROFILE_KEY);
  if (!raw) return null;

  try {
    const { profile, ts } = JSON.parse(raw);
    if (Date.now() - ts > TTL_MS) {
      localStorage.removeItem(PROFILE_KEY);
      return null; // stale
    }
    return profile; // fresh
  } catch {
    localStorage.removeItem(PROFILE_KEY);
    return null;
  }
}

export function clearProfileCache() {
  localStorage.removeItem(PROFILE_KEY);
}

export function clearUserCaches() {
  clearHistoryCache();
  clearProfileCache();
}
