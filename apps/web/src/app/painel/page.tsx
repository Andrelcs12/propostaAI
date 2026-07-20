import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getBillingUsage } from "@/features/billing/services/billing.service";
import { DashboardOverview } from "@/features/dashboard/components/dashboard-overview";
import { getCurrentProfile } from "@/features/auth/services/profile.service";
import { listProposals } from "@/features/proposals/services/proposal.service";
import { requireOnboardingStatus } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { accessToken, companyStatus } = await requireOnboardingStatus();

  if (!companyStatus.onboardingDone || !companyStatus.company) {
    redirect("/onboarding");
  }

  const profile = await getCurrentProfile(accessToken);
  const company = companyStatus.company;
  const [proposals, usage] = await Promise.all([
    listProposals(accessToken),
    getBillingUsage(accessToken),
  ]);
  const displayName = company.tradeName ?? company.name;

  return (
    <AppShell profile={profile}>
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Painel</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">
          Ola, {displayName}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Acompanhe o uso do plano gratuito, visualize o historico de propostas
          e confira como sua identidade visual aparece nos templates.
        </p>
      </div>

      <DashboardOverview
        company={company}
        proposals={proposals}
        usage={usage}
      />
    </AppShell>
  );
}
