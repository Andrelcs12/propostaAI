import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { getBillingUsage } from "@/features/billing/services/billing.service";
import { getCurrentProfile } from "@/features/auth/services/profile.service";
import { ProposalsHistory } from "@/features/proposals/components/proposals-history";
import { listProposals } from "@/features/proposals/services/proposal.service";
import { requireOnboardingStatus } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function ProposalsPage() {
  const { accessToken, companyStatus } = await requireOnboardingStatus();

  if (!companyStatus.onboardingDone) {
    redirect("/onboarding");
  }

  const profile = await getCurrentProfile(accessToken);
  const [proposals, usage] = await Promise.all([
    listProposals(accessToken),
    getBillingUsage(accessToken),
  ]);

  return (
    <AppShell profile={profile}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Propostas</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">
            Historico e gestao
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Crie, edite e acompanhe propostas com a identidade visual da sua
            empresa. Plano gratuito: {usage.proposalsUsed}/{usage.proposalsLimit}.
          </p>
        </div>
        <Button asChild disabled={!usage.canCreateProposal}>
          <Link href="/propostas/nova">Nova proposta</Link>
        </Button>
      </div>

      <ProposalsHistory proposals={proposals} usage={usage} />
    </AppShell>
  );
}
