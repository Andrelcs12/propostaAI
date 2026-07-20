import { Injectable } from "@nestjs/common";
import { ProposalStatus } from "../../generated/prisma/enums";
import { PrismaService } from "../../database/prisma.service";

export type ProposalReference = {
  id: string;
  title: string;
  clientName: string;
  status: ProposalStatus;
  serviceOffered: string | null;
  createdAt: Date;
  score: number;
  reason: string;
  summary: string;
};

@Injectable()
export class ProposalReferenceService {
  constructor(private readonly prisma: PrismaService) {}

  async getRecommendations(input: {
    userId: string;
    excludeProposalId?: string;
    serviceOffered?: string | null;
    clientSegment?: string | null;
    tone?: string | null;
    template?: string | null;
  }) {
    const proposals = await this.prisma.proposal.findMany({
      where: {
        userId: input.userId,
        generatedContent: { not: null as never },
        ...(input.excludeProposalId
          ? { id: { not: input.excludeProposalId } }
          : {}),
      },
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: {
        id: true,
        title: true,
        clientName: true,
        status: true,
        serviceOffered: true,
        clientSegment: true,
        tone: true,
        styleSnapshot: true,
        generatedContent: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const ranked = proposals
      .map((proposal) => this.scoreProposal(proposal, input))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    return ranked;
  }

  buildReferenceSummary(
    proposal: {
      title: string;
      serviceOffered: string | null;
      tone: string;
      generatedContent: unknown;
    } | null,
  ) {
    if (!proposal?.generatedContent) {
      return null;
    }

    const content = proposal.generatedContent as Record<string, unknown>;

    return [
      `Titulo: ${proposal.title}`,
      proposal.serviceOffered ? `Servico: ${proposal.serviceOffered}` : null,
      `Tom: ${proposal.tone}`,
      content.introduction
        ? `Introducao (estrutura): ${String(content.introduction).slice(0, 400)}`
        : null,
      content.proposedSolution
        ? `Solucao (estrutura): ${String(content.proposedSolution).slice(0, 400)}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");
  }

  private scoreProposal(
    proposal: {
      id: string;
      title: string;
      clientName: string;
      status: ProposalStatus;
      serviceOffered: string | null;
      clientSegment: string | null;
      tone: string;
      styleSnapshot: unknown;
      generatedContent: unknown;
      createdAt: Date;
      updatedAt: Date;
    },
    input: {
      serviceOffered?: string | null;
      clientSegment?: string | null;
      tone?: string | null;
      template?: string | null;
    },
  ): ProposalReference {
    let score = 0;
    const reasons: string[] = [];

    if (proposal.status === ProposalStatus.ACCEPTED) {
      score += 6;
      reasons.push("foi aceita");
    }

    if (
      input.serviceOffered &&
      proposal.serviceOffered &&
      this.normalize(input.serviceOffered) ===
        this.normalize(proposal.serviceOffered)
    ) {
      score += 4;
      reasons.push("mesmo servico");
    }

    if (
      input.clientSegment &&
      proposal.clientSegment &&
      this.normalize(input.clientSegment) ===
        this.normalize(proposal.clientSegment)
    ) {
      score += 3;
      reasons.push("mesmo segmento");
    }

    if (input.tone && proposal.tone === input.tone) {
      score += 2;
      reasons.push("mesmo tom");
    }

    const style = proposal.styleSnapshot as { visualStyle?: string } | null;
    if (input.template && style?.visualStyle === input.template) {
      score += 1;
      reasons.push("mesmo template");
    }

    if (proposal.generatedContent) {
      score += 1;
      reasons.push("conteudo completo");
    }

    const ageDays = Math.max(
      0,
      (Date.now() - proposal.updatedAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    const recencyScore = Math.max(0, 2 - Math.floor(ageDays / 30));
    score += recencyScore;

    if (recencyScore > 0) {
      reasons.push("recente");
    }

    const content = proposal.generatedContent as
      | { introduction?: string }
      | null;

    return {
      id: proposal.id,
      title: proposal.title,
      clientName: proposal.clientName,
      status: proposal.status,
      serviceOffered: proposal.serviceOffered,
      createdAt: proposal.createdAt,
      score,
      reason:
        reasons.length > 0
          ? `Selecionada porque ${reasons.slice(0, 3).join(", ")}.`
          : "Proposta anterior disponivel como referencia.",
      summary: content?.introduction?.slice(0, 160) ?? proposal.title,
    };
  }

  private normalize(value: string) {
    return value.trim().toLowerCase();
  }
}
