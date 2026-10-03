import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/database.types";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  response.headers.set("Cache-Control", "private, no-store");
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: {
        fetch: (input, init) =>
          fetch(input, {
            ...init,
            cache: "no-store",
            signal: init?.signal ?? AbortSignal.timeout(15000),
          }),
      },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          if (headers)
            Object.entries(headers).forEach(([name, value]) =>
              response.headers.set(name, value),
            );
          response.headers.set("Cache-Control", "private, no-store");
        },
      },
    },
  );
  await supabase.auth.getClaims();
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
