import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";


export async function middleware(request) {
  let response = NextResponse.next({ request });

  // Middleware reads/writes cookies on the request/response, not next/headers
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Validates the session and refreshes expired tokens
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Only /account is matched (settings also works signed out)
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/account/:path*"],
};
