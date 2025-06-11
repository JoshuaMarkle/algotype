import { supabase } from "@/lib/supabaseClient";

export async function fetchProblems(mode = "files") {
  const { data, error } = await supabase
    .from("challenges")
    .select("id, title, description, lines, language, source, slug")
    .eq("mode", mode);

  return { data, error };
}
