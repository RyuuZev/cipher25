import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_COOKIE, isValidToken } from "@/lib/access-core";

const GATED_PREFIXES = ["/profil"];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const gated =
    pathname === "/" ||
    GATED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (gated) {
    const unlocked = await isValidToken(
      request.cookies.get(ACCESS_COOKIE)?.value,
    );

    if (!unlocked) {
      const gateUrl = request.nextUrl.clone();
      gateUrl.pathname = "/masuk";
      gateUrl.search = "";

      if (pathname !== "/" || search) {
        gateUrl.searchParams.set("next", `${pathname}${search}`);
      }

      return NextResponse.redirect(gateUrl);
    }
  }

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next({ request });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/", "/profil/:path*"],
};
