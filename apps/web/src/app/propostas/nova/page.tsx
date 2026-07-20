import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/features/auth/services/profile.service";
import { ProposalCreateForm } from "@/features/proposals/components/proposal-create-form";
import { requireOnboardingStatus } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function NewProposalPage() {
  const { accessToken, companyStatus } = await requireOnboardingStatus();

  if (!companyStatus.onboardingDone || !companyStatus.company) {
    redirect("/onboarding");
  }

  const profile = await getCurrentProfile(accessToken);

  return (
    <AppShell profile={profile}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Nova proposta</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">
            Criar proposta comercial
          </h1>
          <p className="mt-2 text-muted-foreground">
            Preencha os dados do cliente e da proposta antes de gerar o
            conteudo.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/propostas">Voltar</Link>
        </Button>
      </div>
      <ProposalCreateForm company={companyStatus.company} />
    </AppShell>
  );
}
