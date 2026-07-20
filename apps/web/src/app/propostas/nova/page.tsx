import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { UpgradeCard } from "@/features/billing/components/upgrade-card";
import { UsageMeter } from "@/features/billing/components/usage-meter";
import { getBillingUsage } from "@/features/billing/services/billing.service";
import { getCurrentProfile } from "@/features/auth/services/profile.service";
import { ProposalWizard } from "@/features/proposals/components/proposal-wizard";
import { requireOnboardingStatus } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function NewProposalPage() {
  const { accessToken, companyStatus } = await requireOnboardingStatus();

  if (!companyStatus.onboardingDone || !companyStatus.company) {
    redirect("/onboarding");
  }

  const profile = await getCurrentProfile(accessToken);
  const usage = await getBillingUsage(accessToken);

  return (
    <AppShell profile={profile}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Nova proposta</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">
            Criar proposta comercial
          </h1>
          <p className="mt-2 text-muted-foreground">
            Quatro etapas objetivas para gerar sua proposta com IA.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/propostas">Voltar</Link>
        </Button>
      </div>

      <div className="mb-6">
        <UsageMeter usage={usage} compact />
      </div>

      {usage.canCreateProposal ? (
        <ProposalWizard company={companyStatus.company} />
      ) : (
        <div className="mx-auto max-w-lg space-y-6 text-center">
          <div className="rounded-xl border border-dashed px-6 py-10">
            <p className="text-lg font-medium">
              Você utilizou suas 3 propostas gratuitas
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Continue criando propostas profissionais com pesquisa de empresas,
              IA, PDF e links públicos com o plano Pro.
            </p>
          </div>
          <UpgradeCard />
          <Button asChild variant="outline">
            <Link href="/propostas">Voltar para minhas propostas</Link>
          </Button>
        </div>
      )}
    </AppShell>
  );
}
