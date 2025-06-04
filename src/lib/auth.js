import { supabase } from "./supabaseClient";

export async function loginWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Error during sign-in:", error.message);
  } else {
    window.location.href = data.url;
  }
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error during sign-out:", error.message);
  }
}
