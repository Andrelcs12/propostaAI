"use client";

import {
  Building2,
  FileDown,
  FileText,
  LayoutDashboard,
  Palette,
  SlidersHorizontal,
  UserCircle2,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrandPreview } from "./brand-preview";
import { CompanyBasicForm } from "./company-basic-form";
import { CompanyBrandForm } from "./company-brand-form";
import { CompanyDefaultsForm } from "./company-defaults-form";
import { CompanyIdentityForm } from "./company-identity-form";
import { ProfileTypeForm } from "./profile-type-form";
import type { Company } from "../types/company";
import { BillingSettingsPanel } from "@/features/billing/components/billing-settings-panel";
import {
  getBillingTypeLabel,
  getFontPreferenceLabel,
  getProfileTypeLabel,
  getProposalToneLabel,
  getVisualStyleLabel,
} from "../utils/labels";

type SettingsProfile = {
  email: string;
  name: string;
};

type SettingsTabsProps = {
  initialCompany: Company;
  profile: SettingsProfile;
};

const tabs = [
  {
    id: "visao-geral",
    label: "Visao geral",
    shortLabel: "Geral",
    icon: LayoutDashboard,
    description: "Resumo da conta e preview do documento comercial.",
  },
  {
    id: "perfil",
    label: "Perfil comercial",
    shortLabel: "Perfil",
    icon: UserCircle2,
    description: "Dados da empresa ou profissional autonomo.",
  },
  {
    id: "marca",
    label: "Marca e documento",
    shortLabel: "Marca",
    icon: Palette,
    description: "Identidade visual e textos que entram no PDF.",
  },
  {
    id: "propostas",
    label: "Padroes das propostas",
    shortLabel: "Propostas",
    icon: SlidersHorizontal,
    description: "Validade, cobranca, tom e mensagens padrao.",
  },
  {
    id: "conta",
    label: "Conta e exportacao",
    shortLabel: "Conta",
    icon: Building2,
    description: "Login, plano e formato de entrega.",
  },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function SettingsTabs({ initialCompany, profile }: SettingsTabsProps) {
  const [company, setCompany] = useState(initialCompany);
  const [activeTab, setActiveTab] = useState<TabId>("visao-geral");

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

  const currentTab = tabs.find((tab) => tab.id === activeTab)!;

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <nav className="space-y-1 lg:sticky lg:top-6 lg:self-start">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-all",
                isActive
                  ? "border-primary bg-primary/8 text-primary shadow-sm"
                  : "border-transparent bg-transparent text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="min-w-0 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">{currentTab.label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentTab.description}
          </p>
        </div>

        {activeTab === "visao-geral" ? (
          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Resumo comercial</CardTitle>
                  <CardDescription>
                    Configuracao atual aplicada em novas propostas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2 text-sm">
                  <SummaryRow
                    label="Nome"
                    value={company.tradeName ?? company.name}
                  />
                  <SummaryRow
                    label="Perfil"
                    value={getProfileTypeLabel(company.profileType)}
                  />
                  <SummaryRow label="Segmento" value={company.segment ?? "—"} />
                  <SummaryRow
                    label="Tom padrao"
                    value={getProposalToneLabel(company.defaultTone)}
                  />
                  <SummaryRow
                    label="Template"
                    value={getVisualStyleLabel(company.visualStyle)}
                  />
                  <SummaryRow
                    label="Fonte"
                    value={getFontPreferenceLabel(company.fontPreference)}
                  />
                  <SummaryRow
                    label="Validade"
                    value={`${company.defaultValidityDays} dias`}
                  />
                  <SummaryRow
                    label="Cobranca"
                    value={getBillingTypeLabel(company.defaultBillingType)}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Atalhos</CardTitle>
                  <CardDescription>
                    Ajuste rapido das areas mais usadas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <TabShortcut
                    label="Editar perfil"
                    onClick={() => setActiveTab("perfil")}
                  />
                  <TabShortcut
                    label="Identidade visual"
                    onClick={() => setActiveTab("marca")}
                  />
                  <TabShortcut
                    label="Padroes comerciais"
                    onClick={() => setActiveTab("propostas")}
                  />
                </CardContent>
              </Card>

              <ExportInfoCard compact />
            </div>

            <BrandPreview company={company} brand={brandInput} compact />
          </div>
        ) : null}

        {activeTab === "perfil" ? (
          <Card>
            <CardContent className="space-y-8 pt-6">
              <ProfileTypeForm
                company={company}
                submitLabel="Salvar tipo de perfil"
                onSaved={setCompany}
              />
              <div className="border-t pt-8">
                <CompanyBasicForm
                  company={company}
                  submitLabel="Salvar perfil comercial"
                  onSaved={setCompany}
                />
              </div>
            </CardContent>
          </Card>
        ) : null}

        {activeTab === "marca" ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Identidade visual</CardTitle>
                <CardDescription>
                  Logo, cores, fonte e template usados no PDF exportado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompanyBrandForm
                  company={company}
                  submitLabel="Salvar identidade visual"
                  embedded
                  onSaved={setCompany}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Apresentacao no documento</CardTitle>
                <CardDescription>
                  Nome, assinatura, contato e rodape que entram em toda proposta.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompanyIdentityForm
                  company={company}
                  submitLabel="Salvar apresentacao"
                  onSaved={setCompany}
                />
              </CardContent>
            </Card>
          </div>
        ) : null}

        {activeTab === "propostas" ? (
          <Card>
            <CardHeader>
              <CardTitle>Padroes comerciais</CardTitle>
              <CardDescription>
                A IA usa estes valores como base ao gerar novas propostas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyDefaultsForm
                embedded
                company={company}
                submitLabel="Salvar padroes"
                onSaved={setCompany}
              />
            </CardContent>
          </Card>
        ) : null}

        {activeTab === "conta" ? (
          <div className="space-y-6">
            <BillingSettingsPanel />

            <Card>
              <CardHeader>
                <CardTitle>Conta</CardTitle>
                <CardDescription>
                  Autenticacao gerenciada pelo Supabase Auth.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <SummaryRow label="Nome" value={profile.name} />
                <SummaryRow label="E-mail" value={profile.email} />
                <p className="rounded-lg border border-dashed px-4 py-3 text-muted-foreground">
                  Para alterar senha, use a opcao de recuperacao na tela de
                  login.
                </p>
              </CardContent>
            </Card>

            <ExportInfoCard />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function TabShortcut({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg border px-3 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:bg-primary/5"
    >
      {label}
    </button>
  );
}

function ExportInfoCard({ compact }: { compact?: boolean }) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FileDown className="size-4 text-primary" />
          <CardTitle className="text-base">Formato de entrega: PDF</CardTitle>
        </div>
        <CardDescription>
          Proposta comercial em documento unico — nao slides.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>
          O PropostaAI gera um <strong className="text-foreground">documento comercial completo</strong>{" "}
          (A4, multiplas secoes) pronto para enviar ao cliente por e-mail ou
          WhatsApp.
        </p>
        {!compact ? (
          <>
            <div className="grid gap-2 sm:grid-cols-2">
              <FeaturePill icon={FileText} label="PDF profissional" status="Disponivel" />
              <FeaturePill icon={FileDown} label="Link publico" status="Disponivel" />
            </div>
            <p className="text-xs">
              A exportacao PDF usara exatamente o preview que voce configura
              aqui — mesmas cores, fontes, secoes e rodape.
            </p>
          </>
        ) : (
          <p className="text-xs">
            PDF e link publico disponiveis no editor de cada proposta.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function FeaturePill({
  icon: Icon,
  label,
  status,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  status: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-background/80 px-3 py-2">
      <Icon className="size-4 text-primary" />
      <span className="font-medium text-foreground">{label}</span>
      <span className="ml-auto text-xs text-muted-foreground">{status}</span>
    </div>
  );
}
