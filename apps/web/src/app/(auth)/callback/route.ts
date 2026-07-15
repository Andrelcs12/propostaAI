import { type NextRequest, NextResponse } from "next/server";
import { getCompanyStatus } from "@/features/company/services/company.service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/painel";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return NextResponse.redirect(
        new URL("/login?error=sessao", requestUrl.origin),
      );
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token && process.env.NEXT_PUBLIC_API_URL) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        cache: "no-store",
      }).catch(() => null);

      const status = await getCompanyStatus(session.access_token).catch(
        () => null,
      );
      const redirectTo = status?.onboardingDone ? "/painel" : "/onboarding";

      return NextResponse.redirect(new URL(redirectTo, requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
