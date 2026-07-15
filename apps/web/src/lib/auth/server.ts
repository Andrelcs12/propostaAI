import { redirect } from "next/navigation";
import { getCompanyStatus } from "@/features/company/services/company.service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function requireAuthenticatedSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    redirect("/login");
  }

  return {
    user,
    accessToken: session.access_token,
  };
}

export async function requireOnboardingStatus() {
  const session = await requireAuthenticatedSession();
  const companyStatus = await getCompanyStatus(session.accessToken);

  return {
    ...session,
    companyStatus,
  };
}
