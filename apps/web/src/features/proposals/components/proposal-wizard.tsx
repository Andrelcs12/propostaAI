"use client";

import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Search,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Company } from "@/features/company/types/company";
import { SegmentSelect } from "@/features/company/components/segment-select";
import { getCurrentAccessToken } from "@/features/company/services/session-token.service";
import { resolveBusinessSegment } from "@novely/shared";
import { ToneSelector } from "./tone-selector";
import {
  createEmptyInvestmentItem,
  createEmptyListItem,
  createEmptyTimelineItem,
  type CreateProposalInput,
} from "../schemas/proposal.schema";
import {
  analyzeCompany,
  searchCompanies,
  type CompanyAnalysis,
  type CompanyCandidate,
} from "../services/company-research.service";
import {
  createProposal,
  generateProposalContent,
} from "../services/proposal.service";
import type { ProposalTone } from "../types/proposal";
import { cn } from "@/lib/utils";

type ProposalWizardProps = {
  company: Company;
};

type ReferenceMode = "auto" | "manual" | "none";

const STEPS = ["Cliente", "Projeto", "Inteligência", "Revisar"];

const GENERATION_STAGES = [
  "Analisando contexto",
  "Organizando escopo",
  "Criando investimento e cronograma",
  "Montando documento",
  "Finalizando proposta",
];

export function ProposalWizard({ company }: ProposalWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [searching, setSearching] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState(0);
  const [candidates, setCandidates] = useState<CompanyCandidate[]>([]);
  const [research, setResearch] = useState<CompanyAnalysis | null>(null);
  const [references, setReferences] = useState<
    Array<{
      id: string;
      title: string;
      clientName: string;
      status: string;
      reason: string;
    }>
  >([]);
  const [referenceMode, setReferenceMode] = useState<ReferenceMode>("auto");
  const [selectedReferenceId, setSelectedReferenceId] = useState<
    string | null
  >(null);
  const [tone, setTone] = useState<ProposalTone>(company.defaultTone);

  const defaultValidity = new Date();
  defaultValidity.setDate(
    defaultValidity.getDate() + company.defaultValidityDays,
  );

  const [form, setForm] = useState({
    clientName: "",
    clientCity: "",
    clientState: "",
    clientWebsite: "",
    clientContactName: "",
    clientEmail: "",
    clientPhone: "",
    clientSegment: "",
    clientDescription: "",
    clientProblem: "",
    title: "",
    serviceOffered: "",
    objective: "",
    scopeText: "",
    deliverablesText: "",
    timelineText: "",
    investmentAmount: "",
    paymentConditions: company.defaultPaymentConditions ?? "",
    validityDate: defaultValidity.toISOString().slice(0, 10),
    observations: "",
  });

  useEffect(() => {
    void loadReferences();
  }, []);

  async function loadReferences() {
    try {
      const accessToken = await getCurrentAccessToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/proposals/references`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      if (response.ok) {
        const data = (await response.json()) as typeof references;
        setReferences(data);
        if (data[0]) setSelectedReferenceId(data[0].id);
      }
    } catch {
      // optional
    }
  }

  function updateField<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleSearchCompanies() {
    if (!form.clientName.trim()) {
      toast.error("Informe o nome do cliente ou empresa.");
      return;
    }

    try {
      setSearching(true);
      const accessToken = await getCurrentAccessToken();
      const result = await searchCompanies(accessToken, {
        name: form.clientName,
        ...(form.clientCity ? { city: form.clientCity } : {}),
        ...(form.clientState ? { state: form.clientState } : {}),
        ...(form.clientWebsite ? { website: form.clientWebsite } : {}),
      });
      setCandidates(result.candidates);
      if (result.candidates.length === 0) {
        toast.message("Nenhum resultado encontrado. Preencha manualmente.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro na pesquisa.",
      );
    } finally {
      setSearching(false);
    }
  }

  async function handleSelectCandidate(candidate: CompanyCandidate) {
    updateField("clientName", candidate.name);
    if (candidate.website) updateField("clientWebsite", candidate.website);
    if (candidate.segment)
      updateField("clientSegment", resolveBusinessSegment(candidate.segment));
    if (candidate.description)
      updateField("clientDescription", candidate.description);

    try {
      setSearching(true);
      const accessToken = await getCurrentAccessToken();
      const analysis = await analyzeCompany(accessToken, {
        name: candidate.name,
        ...(candidate.website ? { website: candidate.website } : {}),
        ...(candidate.sourceUrl ? { sourceUrls: [candidate.sourceUrl] } : {}),
      });
      setResearch(analysis);
      if (analysis.segment)
        updateField("clientSegment", resolveBusinessSegment(analysis.segment));
      if (analysis.summary)
        updateField("clientDescription", analysis.summary);
      toast.success("Dados da empresa carregados.");
    } catch {
      toast.message("Continue preenchendo manualmente.");
    } finally {
      setSearching(false);
    }
  }

  function buildProposalInput(): CreateProposalInput {
    const scopeItems = form.scopeText
      .split("\n")
      .filter(Boolean)
      .map((line, index) => ({
        id: `scope-${index}`,
        title: line.trim(),
        description: "",
      }));

    const deliverableItems = form.deliverablesText
      .split("\n")
      .filter(Boolean)
      .map((line, index) => ({
        id: `del-${index}`,
        title: line.trim(),
        description: "",
      }));

    const timelineItems = form.timelineText
      .split("\n")
      .filter(Boolean)
      .map((line, index) => ({
        ...createEmptyTimelineItem(index),
        title: line.trim(),
      }));

    const amount = Number(form.investmentAmount.replace(",", ".")) || 0;

    return {
      clientName: form.clientName,
      clientContactName: form.clientContactName,
      clientEmail: form.clientEmail,
      clientPhone: form.clientPhone,
      clientSegment: form.clientSegment,
      clientWebsite: form.clientWebsite,
      clientDescription: form.clientDescription,
      clientProblem: form.clientProblem,
      title: form.title || `Proposta para ${form.clientName}`,
      serviceOffered: form.serviceOffered,
      objective: form.objective,
      scope: scopeItems.length ? scopeItems : [createEmptyListItem()],
      deliverables: deliverableItems.length
        ? deliverableItems
        : [createEmptyListItem()],
      timeline: timelineItems.length
        ? timelineItems
        : [createEmptyTimelineItem(0)],
      investment: amount
        ? [{ ...createEmptyInvestmentItem(0), label: "Investimento", amount }]
        : [createEmptyInvestmentItem(0)],
      paymentConditions: form.paymentConditions,
      validityDate: form.validityDate,
      observations: form.observations,
      differentials: [],
      nextSteps: "",
      terms: company.defaultTerms ?? "",
      tone,
    };
  }

  async function handleGenerate() {
    try {
      setGenerating(true);
      setGenerationStage(0);
      const stageTimer = window.setInterval(() => {
        setGenerationStage((current) =>
          Math.min(current + 1, GENERATION_STAGES.length - 1),
        );
      }, 1800);

      const accessToken = await getCurrentAccessToken();
      const input = buildProposalInput();
      const proposal = await createProposal(accessToken, input);

      if (research) {
        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/proposals/${proposal.id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              companyResearchSnapshot: research,
              companyResearchSources: research.sources,
              companyResearchConfirmedAt: new Date().toISOString(),
            }),
          },
        );
      }

      const referenceIds =
        referenceMode === "none"
          ? []
          : referenceMode === "manual" && selectedReferenceId
            ? [selectedReferenceId]
            : references[0]
              ? [references[0].id]
              : [];

      await generateProposalContent(accessToken, proposal.id, {
        tone,
        referenceProposalIds: referenceIds,
      });

      window.clearInterval(stageTimer);
      toast.success("Proposta gerada com sucesso.");
      router.push(`/propostas/${proposal.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Falha ao gerar proposta.",
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {STEPS.map((label, index) => (
          <div
            key={label}
            className={cn(
              "rounded-full px-3 py-1 text-sm",
              index === step
                ? "bg-primary text-primary-foreground"
                : index < step
                  ? "bg-primary/15 text-primary"
                  : "bg-muted text-muted-foreground",
            )}
          >
            {index + 1}. {label}
          </div>
        ))}
      </div>

      {step === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Dados do cliente</CardTitle>
            <CardDescription>
              Pesquise a empresa ou preencha manualmente.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 grid gap-2">
              <Label htmlFor="clientName">Nome do cliente ou empresa</Label>
              <Input
                id="clientName"
                value={form.clientName}
                onChange={(e) => updateField("clientName", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientCity">Cidade</Label>
              <Input
                id="clientCity"
                value={form.clientCity}
                onChange={(e) => updateField("clientCity", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientState">Estado</Label>
              <Input
                id="clientState"
                maxLength={2}
                value={form.clientState}
                onChange={(e) => updateField("clientState", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientWebsite">Site</Label>
              <Input
                id="clientWebsite"
                value={form.clientWebsite}
                onChange={(e) => updateField("clientWebsite", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientContactName">Contato</Label>
              <Input
                id="clientContactName"
                value={form.clientContactName}
                onChange={(e) =>
                  updateField("clientContactName", e.target.value)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientEmail">E-mail</Label>
              <Input
                id="clientEmail"
                type="email"
                value={form.clientEmail}
                onChange={(e) => updateField("clientEmail", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientPhone">Telefone</Label>
              <Input
                id="clientPhone"
                value={form.clientPhone}
                onChange={(e) => updateField("clientPhone", e.target.value)}
              />
            </div>
            <SegmentSelect
              id="clientSegment"
              label="Segmento do cliente"
              value={form.clientSegment}
              onChange={(value) => updateField("clientSegment", value)}
            />
            <div className="md:col-span-2 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSearchCompanies}
                disabled={searching}
              >
                {searching ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Search className="mr-2 size-4" />
                )}
                Pesquisar empresa
              </Button>
            </div>
            {candidates.length > 0 ? (
              <div className="md:col-span-2 space-y-2">
                <p className="text-sm font-medium">Resultados encontrados</p>
                {candidates.map((candidate) => (
                  <button
                    key={`${candidate.name}-${candidate.website ?? ""}`}
                    type="button"
                    onClick={() => handleSelectCandidate(candidate)}
                    className="w-full rounded-lg border p-3 text-left hover:bg-muted/50"
                  >
                    <p className="font-medium">{candidate.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {[candidate.location, candidate.segment]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </button>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      {step === 1 ? (
        <Card>
          <CardHeader>
            <CardTitle>Contexto do projeto</CardTitle>
            <CardDescription>
              Informações essenciais para gerar a proposta.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label>Serviço oferecido</Label>
              <Input
                value={form.serviceOffered}
                onChange={(e) => updateField("serviceOffered", e.target.value)}
                placeholder="Ex.: Consultoria de marketing digital"
              />
            </div>
            <div className="grid gap-2">
              <Label>Objetivo do cliente</Label>
              <Textarea
                value={form.objective}
                onChange={(e) => updateField("objective", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Problema ou oportunidade</Label>
              <Textarea
                value={form.clientProblem}
                onChange={(e) => updateField("clientProblem", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Escopo inicial (um item por linha)</Label>
              <Textarea
                value={form.scopeText}
                onChange={(e) => updateField("scopeText", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Entregáveis (um item por linha)</Label>
              <Textarea
                value={form.deliverablesText}
                onChange={(e) => updateField("deliverablesText", e.target.value)}
              />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Prazo desejado</Label>
                <Textarea
                  value={form.timelineText}
                  onChange={(e) => updateField("timelineText", e.target.value)}
                  placeholder="Semana 1: diagnóstico"
                />
              </div>
              <div className="grid gap-2">
                <Label>Investimento estimado (R$)</Label>
                <Input
                  value={form.investmentAmount}
                  onChange={(e) =>
                    updateField("investmentAmount", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Condições de pagamento</Label>
              <Input
                value={form.paymentConditions}
                onChange={(e) =>
                  updateField("paymentConditions", e.target.value)
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Observações</Label>
              <Textarea
                value={form.observations}
                onChange={(e) => updateField("observations", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Pesquisa sobre o cliente</CardTitle>
              <CardDescription>
                Confirme, edite ou continue sem pesquisa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={form.clientDescription}
                onChange={(e) =>
                  updateField("clientDescription", e.target.value)
                }
                placeholder="Resumo do cliente"
              />
              {research?.possibleOpportunities?.length ? (
                <div className="rounded-lg bg-muted/50 p-3 text-sm">
                  <p className="font-medium">Possíveis oportunidades</p>
                  <ul className="mt-2 list-disc pl-5 text-muted-foreground">
                    {research.possibleOpportunities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {research?.sources?.length ? (
                <div className="text-xs text-muted-foreground">
                  Fontes:{" "}
                  {research.sources.map((s) => s.title).join(", ")}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modelo de referência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(["auto", "manual", "none"] as ReferenceMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setReferenceMode(mode)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left",
                    referenceMode === mode && "border-primary bg-primary/5",
                  )}
                >
                  {mode === "auto"
                    ? "Automático — recomendado"
                    : mode === "manual"
                      ? "Selecionar proposta"
                      : "Sem referência"}
                </button>
              ))}
              {referenceMode === "manual"
                ? references.map((ref) => (
                    <button
                      key={ref.id}
                      type="button"
                      onClick={() => setSelectedReferenceId(ref.id)}
                      className={cn(
                        "w-full rounded-lg border p-3 text-left text-sm",
                        selectedReferenceId === ref.id &&
                          "border-primary bg-primary/5",
                      )}
                    >
                      <p className="font-medium">{ref.title}</p>
                      <p className="text-muted-foreground">{ref.clientName}</p>
                      <p className="mt-1 text-xs">{ref.reason}</p>
                    </button>
                  ))
                : references[0]
                  ? (
                      <p className="text-sm text-muted-foreground">
                        {references[0].reason}
                      </p>
                    )
                  : (
                      <p className="text-sm text-muted-foreground">
                        Nenhuma proposta anterior disponível.
                      </p>
                    )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {step === 3 ? (
        <Card>
          <CardHeader>
            <CardTitle>Revisar e gerar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm md:grid-cols-2">
              <div>
                <p className="font-medium">Cliente</p>
                <p className="text-muted-foreground">{form.clientName}</p>
              </div>
              <div>
                <p className="font-medium">Serviço</p>
                <p className="text-muted-foreground">
                  {form.serviceOffered || "—"}
                </p>
              </div>
              <div>
                <p className="font-medium">Referência</p>
                <p className="text-muted-foreground">
                  {referenceMode === "none"
                    ? "Sem referência"
                    : references[0]?.title ?? "Automática"}
                </p>
              </div>
              <div>
                <p className="font-medium">Tom</p>
                <ToneSelector value={tone} onChange={setTone} />
              </div>
            </div>

            {generating ? (
              <div className="rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Loader2 className="size-4 animate-spin" />
                  {GENERATION_STAGES[generationStage]}
                </div>
              </div>
            ) : (
              <Button className="w-full" onClick={handleGenerate}>
                <Sparkles className="mr-2 size-4" />
                Gerar proposta com IA
              </Button>
            )}
          </CardContent>
        </Card>
      ) : null}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          disabled={step === 0 || generating}
          onClick={() => setStep((current) => current - 1)}
        >
          <ArrowLeft className="mr-2 size-4" />
          Voltar
        </Button>
        {step < 3 ? (
          <Button
            type="button"
            onClick={() => setStep((current) => current + 1)}
            disabled={step === 0 && !form.clientName.trim()}
          >
            Continuar
            <ArrowRight className="ml-2 size-4" />
          </Button>
        ) : (
          <Button asChild variant="ghost">
            <Link href="/propostas">Cancelar</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
