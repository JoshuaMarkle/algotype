import { supabase } from "@/lib/supabaseClient";

export const FEEDBACK_KINDS = [
  { value: "bug", label: "Bug report" },
  { value: "feature", label: "Feature request" },
  { value: "review", label: "Review" },
];

export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 2000;
const EMAIL_MAX = 254;

// Check and normalize a feedback form (limits match the table's CHECKs)
export function validateFeedback({ kind, message, email }) {
  const cleanMessage = (message ?? "").trim();
  const cleanEmail = (email ?? "").trim();

  if (!FEEDBACK_KINDS.some((k) => k.value === kind)) {
    return { error: "Pick a feedback type." };
  }
  if (cleanMessage.length < MESSAGE_MIN) {
    return { error: `Write at least ${MESSAGE_MIN} characters.` };
  }
  if (cleanMessage.length > MESSAGE_MAX) {
    return { error: `Keep it under ${MESSAGE_MAX} characters.` };
  }
  if (
    cleanEmail &&
    (cleanEmail.length > EMAIL_MAX ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail))
  ) {
    return { error: "That email doesn't look right." };
  }

  return {
    data: { kind, message: cleanMessage, email: cleanEmail || null },
  };
}

// Send feedback (signed in or not). The table is insert-only, so no .select()
export async function submitFeedback(form) {
  const { data, error } = validateFeedback(form);
  if (error) return { error };

  const page =
    typeof window !== "undefined"
      ? window.location.pathname.slice(0, 200)
      : null;

  const { error: dbError } = await supabase
    .from("feedback")
    .insert({ ...data, page });

  if (dbError) {
    console.error("Feedback submit failed:", dbError.message);
    return {
      error:
        "Couldn't send your feedback right now. Try the GitHub links below.",
    };
  }
  return { error: null };
}
