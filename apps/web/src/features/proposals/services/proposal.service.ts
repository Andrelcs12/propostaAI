import { apiFetch } from "@/lib/api/client";
import type { CreateProposalInput } from "../schemas/proposal.schema";
import type {
  GeneratedProposalContent,
  Proposal,
  ProposalSummary,
  ProposalTone,
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
  input?: { tone?: ProposalTone; section?: string },
): Promise<Proposal> {
  return apiFetch<Proposal>(`/api/proposals/${id}/generate`, {
    method: "POST",
    accessToken,
    body: JSON.stringify(input ?? {}),
  });
}
