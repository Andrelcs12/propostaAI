import { redirect } from "next/navigation";
import { PropostaLogo } from "@/components/brand/proposta-logo";
import { LogoutButton } from "@/components/layout/logout-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { OnboardingApiError } from "@/features/company/components/onboarding-api-error";
import { OnboardingFlow } from "@/features/company/components/onboarding-flow";
import { OnboardingWelcome } from "@/features/company/components/onboarding-welcome";
import { getCompanyStatus } from "@/features/company/services/company.service";
import { requireAuthenticatedSession } from "@/lib/auth/server";
import { ApiError } from "@/lib/api/client";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const session = await requireAuthenticatedSession();

  let companyStatus;

  try {
    companyStatus = await getCompanyStatus(session.accessToken);
  } catch (error) {
    if (error instanceof ApiError) {
      return (
        <OnboardingApiError message={error.message} status={error.status} />
      );
    }

    throw error;
  }

  if (companyStatus.onboardingDone) {
    redirect("/painel");
  }

  return (
    <main className="app-gradient-bg min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container-page flex h-14 items-center justify-between gap-3">
          <PropostaLogo className="size-8" wordmarkClassName="text-sm" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </div>
      </header>

      <section className="container-page py-6 md:py-10">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-[0_24px_80px_rgb(0_0_0/0.08)] backdrop-blur-sm dark:shadow-[0_24px_80px_rgb(0_0_0/0.35)]">
          <OnboardingWelcome user={session.user} />
          <OnboardingFlow
            initialCompany={companyStatus.company}
            initialStep={companyStatus.onboardingStep}
          />
        </div>
      </section>
    </main>
  );
}
