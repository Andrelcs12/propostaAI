"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProposalTone } from "@/features/company/types/company";
import { getCurrentAccessToken } from "@/features/company/services/session-token.service";
import { ProposalDocumentPreview } from "./proposal-document-preview";
import { ToneSelector } from "./tone-selector";
import {
  generateProposalContent,
  updateProposal,
} from "../services/proposal.service";
import type { GeneratedProposalContent, Proposal } from "../types/proposal";

type SaveState = "idle" | "saving" | "saved" | "dirty" | "error";

type ProposalEditorProps = {
  initialProposal: Proposal;
};

export function ProposalEditor({ initialProposal }: ProposalEditorProps) {
  const [proposal, setProposal] = useState(initialProposal);
  const [content, setContent] = useState<GeneratedProposalContent | null>(
    initialProposal.generatedContent,
  );
  const [tone, setTone] = useState<ProposalTone>(initialProposal.tone);
  const [viewMode, setViewMode] = useState<"editor" | "preview">("editor");
  const [saveState, setSaveState] = useState<SaveState>(
    initialProposal.generatedContent ? "saved" : "idle",
  );
  const [isGenerating, setIsGenerating] = useState(
    initialProposal.status === "GENERATING",
  );

  const persistContent = useCallback(
    async (nextContent: GeneratedProposalContent) => {
      setSaveState("saving");
      try {
        const accessToken = await getCurrentAccessToken();
        const updated = await updateProposal(accessToken, proposal.id, {
          generatedContent: nextContent,
          tone,
        });
        setProposal(updated);
        setContent(updated.generatedContent);
        setSaveState("saved");
      } catch (error) {
        setSaveState("error");
        toast.error(
          error instanceof Error
            ? error.message
            : "Erro ao salvar a proposta.",
        );
      }
    },
    [proposal.id, tone],
  );

  useEffect(() => {
    if (saveState !== "dirty" || !content) return;

    const timeout = setTimeout(() => {
      void persistContent(content);
    }, 1200);

    return () => clearTimeout(timeout);
  }, [content, persistContent, saveState]);

  function updateContent(partial: Partial<GeneratedProposalContent>) {
    if (!content) return;
    setContent({ ...content, ...partial });
    setSaveState("dirty");
  }

  async function handleGenerate(section?: string) {
    if (
      content &&
      !section &&
      !window.confirm(
        "Gerar novamente substituira o conteudo atual. Deseja continuar?",
      )
    ) {
      return;
    }

    setIsGenerating(true);
    setProposal((current) => ({ ...current, status: "GENERATING" }));

    try {
      const accessToken = await getCurrentAccessToken();
      const updated = await generateProposalContent(accessToken, proposal.id, {
        tone,
        ...(section ? { section } : {}),
      });
      setProposal(updated);
      setContent(updated.generatedContent);
      setSaveState("saved");
      toast.success(
        section
          ? "Secao regenerada com sucesso."
          : "Proposta gerada com sucesso.",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel gerar a proposta.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  const saveLabel: Record<SaveState, string> = {
    idle: "",
    saving: "Salvando...",
    saved: "Salvo",
    dirty: "Alteracoes nao salvas",
    error: "Erro ao salvar",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{proposal.clientName}</p>
          <h1 className="text-2xl font-semibold">{proposal.title}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {saveLabel[saveState]}
          </span>
          <div className="flex rounded-md border p-1 md:hidden">
            <Button
              type="button"
              size="sm"
              variant={viewMode === "editor" ? "default" : "ghost"}
              onClick={() => setViewMode("editor")}
            >
              Editor
            </Button>
            <Button
              type="button"
              size="sm"
              variant={viewMode === "preview" ? "default" : "ghost"}
              onClick={() => setViewMode("preview")}
            >
              Preview
            </Button>
          </div>
          <Button
            type="button"
            disabled={isGenerating}
            onClick={() => handleGenerate()}
          >
            {isGenerating ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles />
            )}
            {content ? "Regenerar proposta" : "Gerar proposta"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tom da proposta</CardTitle>
          <CardDescription>
            O tom padrao veio das configuracoes, mas pode ser alterado aqui.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ToneSelector
            value={tone}
            disabled={isGenerating}
            onChange={(nextTone) => {
              setTone(nextTone);
              setSaveState("dirty");
            }}
          />
        </CardContent>
      </Card>

      {isGenerating ? (
        <div className="rounded-md border bg-card px-6 py-16 text-center">
          <Loader2 className="mx-auto mb-3 size-6 animate-spin text-primary" />
          <p className="font-medium">Gerando conteudo da proposta...</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Isso pode levar alguns segundos.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <div className={viewMode === "preview" ? "hidden md:block" : ""}>
            {!content ? (
              <div className="rounded-md border border-dashed bg-card px-6 py-16 text-center text-sm text-muted-foreground">
                Gere a proposta para editar o conteudo ou preencha manualmente
                apos a primeira geracao.
              </div>
            ) : (
              <div className="space-y-4">
                <EditableField
                  label="Titulo"
                  value={content.title}
                  onChange={(value) => updateContent({ title: value })}
                />
                <EditableField
                  label="Introducao"
                  value={content.introduction}
                  multiline
                  onChange={(value) => updateContent({ introduction: value })}
                />
                <EditableField
                  label="Contexto do cliente"
                  value={content.clientContext}
                  multiline
                  onChange={(value) => updateContent({ clientContext: value })}
                />
                <EditableField
                  label="Problema"
                  value={content.problem}
                  multiline
                  onChange={(value) => updateContent({ problem: value })}
                />
                <EditableField
                  label="Solucao proposta"
                  value={content.proposedSolution}
                  multiline
                  onChange={(value) =>
                    updateContent({ proposedSolution: value })
                  }
                />
                <EditableField
                  label="Proximos passos"
                  value={content.nextSteps}
                  multiline
                  onChange={(value) => updateContent({ nextSteps: value })}
                />
                <EditableField
                  label="Encerramento"
                  value={content.closing}
                  multiline
                  onChange={(value) => updateContent({ closing: value })}
                />
                <div className="flex flex-wrap gap-2">
                  {[
                    "introduction",
                    "clientContext",
                    "problem",
                    "proposedSolution",
                    "nextSteps",
                    "closing",
                  ].map((section) => (
                    <Button
                      key={section}
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isGenerating}
                      onClick={() => handleGenerate(section)}
                    >
                      Regenerar {section}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={viewMode === "editor" ? "hidden md:block" : ""}>
            <ProposalDocumentPreview
              proposal={proposal}
              content={content}
              emptyMessage="Gere a proposta para visualizar o documento completo."
            />
          </div>
        </div>
      )}
    </div>
  );
}

function EditableField({
  label,
  value,
  multiline,
  onChange,
}: {
  label: string;
  value: string;
  multiline?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium">{label}</span>
      {multiline ? (
        <textarea
          className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          className="h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
    </label>
  );
}
