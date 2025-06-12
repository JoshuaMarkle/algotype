import { supabase } from "@/lib/supabaseClient";

// --- Email/Password ---

export async function signupWithEmail(username, email, password) {
  // Check if the username is already taken (not possible right now)
  // const { data: existingUsername, error: usernameError } = await supabase
  //   .from("profiles")
  //   .select("id")
  //   .ilike("username", username) // case-insensitive uniqueness check
  //   .maybeSingle();

  // if (usernameError) throw new Error(usernameError.message);
  // if (existingUsername) throw new Error("Username already taken");

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

// --- GitHub ---

export async function loginWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Error during GitHub sign-in:", error.message);
  } else {
    window.location.href = data.url;
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

// --- Helpers ---

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  return data.user;
}

export async function getUserProfile() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw new Error(userError.message);

  const userId = userData.user.id;
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", userId)
    .single();

  if (profileError) throw new Error(profileError.message);

  return profile;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error during sign-out:", error.message);
  } else {
    window.location.reload();
  }
}
