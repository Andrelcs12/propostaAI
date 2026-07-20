"use client";

import Link from "next/link";
import {
  Building2,
  FileText,
  History,
  Palette,
  Plus,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UsageMeter } from "@/features/billing/components/usage-meter";
import type { BillingUsage } from "@/features/billing/types/billing";
import { BrandPreview } from "@/features/company/components/brand-preview";
import type { Company } from "@/features/company/types/company";
import {
  getFontPreferenceLabel,
  getProfileTypeLabel,
  getProposalToneLabel,
  getVisualStyleLabel,
} from "@/features/company/utils/labels";
import { PROPOSAL_STATUS_LABELS } from "@/config/templates";
import type { ProposalSummary } from "@/features/proposals/types/proposal";

type DashboardOverviewProps = {
  company: Company;
  proposals: ProposalSummary[];
  usage: BillingUsage;
};

export function DashboardOverview({
  company,
  proposals,
  usage,
}: DashboardOverviewProps) {
  const displayName = company.tradeName ?? company.name;
  const recentProposals = proposals.slice(0, 5);

  const brandInput = {
    logoUrl: company.logoUrl ?? "",
    lightLogoUrl: company.lightLogoUrl ?? "",
    primaryColor: company.primaryColor,
    secondaryColor: company.secondaryColor,
    accentColor: company.accentColor,
    backgroundColor: company.backgroundColor,
    surfaceColor: company.surfaceColor,
    textColor: company.textColor,
    visualPreference: company.visualPreference,
    fontPreference: company.fontPreference,
    visualStyle: company.visualStyle,
    borderRadius: company.borderRadius,
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <UsageMeter usage={usage} />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Acoes rapidas</CardTitle>
            <CardDescription>
              Comece uma proposta ou ajuste a identidade da empresa.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild disabled={!usage.canCreateProposal}>
              <Link href="/propostas/nova">
                <Plus />
                Nova proposta
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/configuracoes">
                <Palette />
                Identidade visual
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/propostas">
                <History />
                Historico de propostas
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard
          icon={FileText}
          label="Propostas criadas"
          value={String(usage.proposalsUsed)}
          hint={`${usage.proposalsRemaining} restantes no plano gratuito`}
        />
        <StatCard
          icon={Building2}
          label="Empresa"
          value={displayName}
          hint={`Tom padrao: ${getProposalToneLabel(company.defaultTone)}`}
        />
        <StatCard
          icon={Sparkles}
          label="Assistente de IA"
          value={usage.aiConfigured ? "Configurada" : "Pendente"}
          hint={
            usage.aiConfigured
              ? "Pronta para gerar propostas"
              : "Configure GEMINI_API_KEY na API"
          }
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Historico recente</CardTitle>
            <CardDescription>
              Ultimas propostas editadas ou geradas pela IA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentProposals.length === 0 ? (
              <div className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
                Nenhuma proposta ainda. Crie a primeira para ver o historico
                aqui.
              </div>
            ) : (
              <div className="space-y-3">
                {recentProposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background/60 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{proposal.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {proposal.clientName} ·{" "}
                        {new Date(proposal.updatedAt).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={proposal.status} />
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/propostas/${proposal.id}`}>Abrir</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Visao da empresa</CardTitle>
              <CardDescription>
                Identidade aplicada nas propostas comerciais.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {[
                  company.primaryColor,
                  company.secondaryColor,
                  company.accentColor,
                  company.backgroundColor,
                ].map((color) => (
                  <span
                    key={color}
                    className="size-8 rounded-md border"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
              <div className="grid gap-2 text-sm">
                <InfoRow
                  label="Template"
                  value={getVisualStyleLabel(company.visualStyle)}
                />
                <InfoRow
                  label="Fonte"
                  value={getFontPreferenceLabel(company.fontPreference)}
                />
                <InfoRow
                  label="Perfil"
                  value={getProfileTypeLabel(company.profileType)}
                />
                <InfoRow
                  label="Validade padrao"
                  value={`${company.defaultValidityDays} dias`}
                />
              </div>
            </CardContent>
          </Card>

          <BrandPreview company={company} brand={brandInput} compact />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 pt-6">
        <div className="rounded-lg bg-primary/10 p-2 text-primary">
          <Icon className="size-4" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-lg font-semibold">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
      {PROPOSAL_STATUS_LABELS[status] ?? status}
    </span>
  );
}
