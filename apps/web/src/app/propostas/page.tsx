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

const statusLabels: Record<string, string> = {
  DRAFT: "Rascunho",
  GENERATING: "Gerando",
  READY: "Pronta",
  SENT: "Enviada",
  VIEWED: "Visualizada",
  ACCEPTED: "Aceita",
  REJECTED: "Recusada",
  EXPIRED: "Expirada",
  ARCHIVED: "Arquivada",
};

export default async function ProposalsPage() {
  const { accessToken, companyStatus } = await requireOnboardingStatus();

  if (!companyStatus.onboardingDone) {
    redirect("/onboarding");
  }

  const profile = await getCurrentProfile(accessToken);
  const proposals = await listProposals(accessToken);

  return (
    <AppShell profile={profile}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Propostas</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">
            Suas propostas comerciais
          </h1>
          <p className="mt-2 text-muted-foreground">
            Crie, edite e acompanhe propostas geradas com a identidade da sua
            conta.
          </p>
        </div>
        <Button asChild>
          <Link href="/propostas/nova">Nova proposta</Link>
        </Button>
      </div>

      {proposals.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma proposta ainda</CardTitle>
            <CardDescription>
              Comece criando sua primeira proposta comercial.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/propostas/nova">Criar primeira proposta</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {proposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>{proposal.title}</CardTitle>
                  <CardDescription>{proposal.clientName}</CardDescription>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                  {statusLabels[proposal.status] ?? proposal.status}
                </span>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  Atualizada em{" "}
                  {new Date(proposal.updatedAt).toLocaleDateString("pt-BR")}
                </p>
                <Button asChild variant="outline">
                  <Link href={`/propostas/${proposal.id}`}>Abrir</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
