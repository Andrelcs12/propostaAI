"use client";

import {
  Copy,
  ExternalLink,
  FileDown,
  Link2,
  Loader2,
  Share2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buildShareUrl } from "@/lib/api/public-proposal";
import { getCurrentAccessToken } from "@/features/company/services/session-token.service";
import {
  downloadProposalPdf,
  publishProposal,
  unpublishProposal,
} from "../services/proposal.service";
import type { Proposal } from "../types/proposal";
import { PROPOSAL_STATUS_LABELS } from "@/config/templates";

type ProposalSharePanelProps = {
  proposal: Proposal;
  hasContent: boolean;
  onUpdated: (proposal: Proposal) => void;
};

export function ProposalSharePanel({
  proposal,
  hasContent,
  onUpdated,
}: ProposalSharePanelProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const shareUrl = proposal.publicToken
    ? buildShareUrl(proposal.publicToken)
    : null;

  async function handlePublish() {
    setIsPublishing(true);
    try {
      const accessToken = await getCurrentAccessToken();
      const result = await publishProposal(accessToken, proposal.id);
      onUpdated(result.proposal);
      toast.success("Link publico ativado para o cliente.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel ativar o link.",
      );
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleUnpublish() {
    setIsPublishing(true);
    try {
      const accessToken = await getCurrentAccessToken();
      const updated = await unpublishProposal(accessToken, proposal.id);
      onUpdated(updated);
      toast.success("Link publico desativado.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel desativar o link.",
      );
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleCopyLink() {
    if (!shareUrl) {
      setIsPublishing(true);
      try {
        const accessToken = await getCurrentAccessToken();
        const result = await publishProposal(accessToken, proposal.id);
        onUpdated(result.proposal);
        await navigator.clipboard.writeText(result.shareUrl);
        toast.success("Link publico ativado e copiado.");
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Nao foi possivel ativar o link.",
        );
      } finally {
        setIsPublishing(false);
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copiado para a area de transferencia.");
    } catch {
      toast.error("Nao foi possivel copiar o link.");
    }
  }

  async function handleDownloadPdf() {
    setIsDownloading(true);
    try {
      const accessToken = await getCurrentAccessToken();
      const { blob, filename } = await downloadProposalPdf(
        accessToken,
        proposal.id,
      );
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success("PDF baixado com sucesso.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel gerar o PDF.",
      );
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="size-4 text-primary" />
          Enviar para o cliente
        </CardTitle>
        <CardDescription>
          Compartilhe um link publico ou baixe o PDF para{" "}
          <span className="font-medium text-foreground">
            {proposal.clientName}
          </span>
          .
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasContent ? (
          <p className="rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground">
            Gere o conteudo da proposta antes de compartilhar ou exportar o PDF.
          </p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                disabled={isPublishing || isDownloading}
                onClick={() => void handleDownloadPdf()}
              >
                {isDownloading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <FileDown />
                )}
                Baixar PDF
              </Button>

              {proposal.publicEnabled ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isPublishing}
                    onClick={() => void handleCopyLink()}
                  >
                    <Copy />
                    Copiar link
                  </Button>
                  {shareUrl ? (
                    <Button asChild type="button" variant="outline">
                      <a href={shareUrl} target="_blank" rel="noreferrer">
                        <ExternalLink />
                        Abrir link
                      </a>
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isPublishing}
                    onClick={() => void handleUnpublish()}
                  >
                    Desativar link
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPublishing}
                  onClick={() => void handlePublish()}
                >
                  {isPublishing ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Link2 />
                  )}
                  Ativar link publico
                </Button>
              )}
            </div>

            {proposal.publicEnabled && shareUrl ? (
              <div className="rounded-lg border bg-muted/20 px-3 py-2 text-sm">
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Link do cliente
                </p>
                <p className="break-all font-mono text-xs">{shareUrl}</p>
              </div>
            ) : null}

            <div className="grid gap-2 text-sm sm:grid-cols-3">
              <Metric label="Status" value={PROPOSAL_STATUS_LABELS[proposal.status] ?? proposal.status} />
              <Metric label="Visualizacoes" value={String(proposal.viewCount)} />
              <Metric
                label="Publicado em"
                value={
                  proposal.publishedAt
                    ? new Date(proposal.publishedAt).toLocaleDateString("pt-BR")
                    : "—"
                }
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
