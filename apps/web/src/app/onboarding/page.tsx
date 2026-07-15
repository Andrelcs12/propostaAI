import { redirect } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { LogoutButton } from "@/components/layout/logout-button";
import { OnboardingFlow } from "@/features/company/components/onboarding-flow";
import { requireOnboardingStatus } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { companyStatus } = await requireOnboardingStatus();

  if (companyStatus.onboardingDone) {
    redirect("/painel");
  }

  return (
    <main className="min-h-screen bg-secondary/30">
      <header className="border-b bg-background">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Logo />
          <LogoutButton />
        </div>
      </header>
      <section className="container-page py-10">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-medium text-primary">Onboarding</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">
            Configure sua empresa
          </h1>
          <p className="mt-2 text-muted-foreground">
            Esses dados serao usados como base para suas propostas comerciais.
          </p>
        </div>
        <OnboardingFlow
          initialCompany={companyStatus.company}
          initialStep={companyStatus.onboardingStep}
        />
      </section>
    </main>
  );
}
