import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createSupabaseServerClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key) => cookies().get(key)?.value,
        set: (key, value, options) => cookies().set(key, value, options),
        remove: (key) => cookies().delete(key),
      },
    },
  );
};
