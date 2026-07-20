import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentProfile } from "@/features/auth/services/profile.service";
import { listProposals } from "@/features/proposals/services/proposal.service";
import { requireOnboardingStatus } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { accessToken, companyStatus } = await requireOnboardingStatus();

  if (!companyStatus.onboardingDone) {
    redirect("/onboarding");
  }

  if (!companyStatus.company) {
    redirect("/onboarding");
  }

  const profile = await getCurrentProfile(accessToken);
  const company = companyStatus.company;
  const proposals = await listProposals(accessToken);
  const displayName = company.tradeName ?? company.name;

  return (
    <AppShell profile={profile}>
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">Painel</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal">
          Ola, {displayName}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Sua conta esta pronta para criar propostas comerciais profissionais.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Proximo passo</CardTitle>
            <CardDescription>
              Crie uma nova proposta ou continue editando as existentes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/propostas/nova">Nova proposta</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/propostas">Ver propostas</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/configuracoes">Configuracoes</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo</CardTitle>
            <CardDescription>Status da sua conta.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm">
            <SummaryItem label="Propostas" value={String(proposals.length)} />
            <SummaryItem
              label="Onboarding"
              value={
                company.onboardingCompletedAt
                  ? "Concluido"
                  : "Concluido"
              }
            />
            <SummaryItem label="Tom padrao" value={company.defaultTone} />
            <SummaryItem
              label="Cor principal"
              value={company.primaryColor}
            />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border bg-card px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
