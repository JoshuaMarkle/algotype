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

export async function loginWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Error during GitHub sign-in:", error.message);
  }
}

export async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Error during Google sign-in:", error.message);
  }
}

// --- Magic Link ---

export async function loginWithMagicLink(email) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
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

export async function linkProvider(provider) {
  const { data, error } = await supabase.auth.linkWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/link-callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  window.location.href = data.url;
}

export async function handleProviderLinkCallback() {
  const { data, error } = await supabase.auth.getSessionFromUrl({
    type: "link",
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function unlinkProvider(provider) {
  const { data: user, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);

  const currentProviders = user.user_metadata?.providers || [];

  if (currentProviders.length <= 1) {
    throw new Error("Cannot remove the only login method.");
  }

  const updatedProviders = currentProviders.filter((p) => p !== provider);
  const { error: updateError } = await supabase.auth.updateUser({
    data: { providers: updatedProviders },
  });

  if (updateError) throw new Error(updateError.message);

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
  if (!forceRefresh) {
    const cached = readProfileCache();
    if (cached) return cached;
  }

  // Get user (localStorage)
  const authUser = await getCurrentUser(); // returns null if not signed in
  if (!authUser) return null;

  // Getb user profile (network)
  const { data: row, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .single();

  if (error) throw error;

  // Merge and cache
  const profile = {
    ...row,
    email: authUser.email,
    avatar_url: authUser.user_metadata?.avatar_url ?? null,
    created_at: authUser.created_at,
    providers: authUser.app_metadata?.providers ?? null,
  };

  cacheProfile(profile);
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

  clearHistoryCache();
  clearProfileCache();
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
