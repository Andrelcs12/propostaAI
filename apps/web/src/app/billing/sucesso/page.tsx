import { redirect } from "next/navigation";
import { BillingSuccessClient } from "@/features/billing/components/billing-success-client";
import { getCurrentProfile } from "@/features/auth/services/profile.service";
import { requireOnboardingStatus } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function BillingSuccessPage() {
  const { accessToken, companyStatus } = await requireOnboardingStatus();

  if (!companyStatus.onboardingDone) {
    redirect("/onboarding");
  }

  const profile = await getCurrentProfile(accessToken);

  return <BillingSuccessClient profile={profile} />;
}
