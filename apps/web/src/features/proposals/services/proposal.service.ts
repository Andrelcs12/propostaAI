import { apiFetch } from "@/lib/api/client";
import type { CreateProposalInput } from "../schemas/proposal.schema";
import type {
  GeneratedProposalContent,
  Proposal,
  ProposalSummary,
  ProposalTone,
  PublishProposalResult,
} from "../types/proposal";

export async function listProposals(
  accessToken: string,
): Promise<ProposalSummary[]> {
  return apiFetch<ProposalSummary[]>("/api/proposals", {
    accessToken,
    cache: "no-store",
  });
}

export async function getProposal(
  accessToken: string,
  id: string,
): Promise<Proposal> {
  return apiFetch<Proposal>(`/api/proposals/${id}`, {
    accessToken,
    cache: "no-store",
  });
}

export async function createProposal(
  accessToken: string,
  input: CreateProposalInput,
): Promise<Proposal> {
  return apiFetch<Proposal>("/api/proposals", {
    method: "POST",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function updateProposal(
  accessToken: string,
  id: string,
  input: Partial<CreateProposalInput> & {
    generatedContent?: GeneratedProposalContent;
  },
): Promise<Proposal> {
  return apiFetch<Proposal>(`/api/proposals/${id}`, {
    method: "PATCH",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function generateProposalContent(
  accessToken: string,
  id: string,
  input?: {
    tone?: ProposalTone;
    section?: string;
    referenceProposalIds?: string[];
  },
): Promise<Proposal> {
  return apiFetch<Proposal>(`/api/proposals/${id}/generate`, {
    method: "POST",
    accessToken,
    body: JSON.stringify(input ?? {}),
  });
}

export async function publishProposal(
  accessToken: string,
  id: string,
): Promise<PublishProposalResult> {
  return apiFetch<PublishProposalResult>(`/api/proposals/${id}/publish`, {
    method: "POST",
    accessToken,
  });
}

export async function unpublishProposal(
  accessToken: string,
  id: string,
): Promise<Proposal> {
  return apiFetch<Proposal>(`/api/proposals/${id}/unpublish`, {
    method: "POST",
    accessToken,
  });
}

export async function downloadProposalPdf(
  accessToken: string,
  id: string,
): Promise<{ blob: Blob; filename: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL nao configurada");
  }

  const response = await fetch(`${baseUrl}/api/proposals/${id}/pdf`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const record =
      typeof body === "object" && body !== null
        ? (body as Record<string, unknown>)
        : null;
    const message =
      typeof record?.message === "string"
        ? record.message
        : "Nao foi possivel baixar o PDF.";
    throw new Error(message);
  }

  const disposition = response.headers.get("Content-Disposition") ?? "";
  const match = disposition.match(/filename="(.+)"/);
  const filename = match?.[1] ?? "proposta.pdf";

  return {
    blob: await response.blob(),
    filename,
  };
}
