import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          if (options) {
            response.cookies.set(name, value, options);
            return;
          }

          response.cookies.set(name, value);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;
  const isProtectedRoute =
    pathname.startsWith("/painel") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/minha-empresa") ||
    pathname.startsWith("/configuracoes") ||
    pathname.startsWith("/propostas");
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/cadastro") ||
    pathname.startsWith("/recuperar-senha") ||
    pathname.startsWith("/redefinir-senha");

  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = await getAuthenticatedRedirectPath(session?.access_token);
    return NextResponse.redirect(url);
  }

  if (user && isProtectedRoute) {
    const redirectPath = await getAuthenticatedRedirectPath(
      session?.access_token,
    );

    if (redirectPath === "/onboarding" && !pathname.startsWith("/onboarding")) {
      const url = request.nextUrl.clone();
      url.pathname = "/onboarding";
      return NextResponse.redirect(url);
    }

    if (redirectPath === "/painel" && pathname.startsWith("/onboarding")) {
      const url = request.nextUrl.clone();
      url.pathname = "/painel";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

async function getAuthenticatedRedirectPath(accessToken?: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!accessToken || !apiUrl) {
    return "/onboarding";
  }

  const response = await fetch(`${apiUrl}/api/company/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  }).catch(() => null);

  if (!response?.ok) {
    return "/onboarding";
  }

  const status = (await response.json().catch(() => null)) as {
    onboardingDone?: boolean;
  } | null;

  return status?.onboardingDone ? "/painel" : "/onboarding";
}
