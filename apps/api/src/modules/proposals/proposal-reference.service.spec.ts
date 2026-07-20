import { describe, expect, it } from "vitest";
import { ProposalReferenceService } from "./proposal-reference.service";
import { ProposalStatus } from "../../generated/prisma/enums";

describe("ProposalReferenceService", () => {
  const prisma = {
    proposal: {
      findMany: async () => [
        {
          id: "p1",
          title: "Proposta A",
          clientName: "Cliente A",
          status: ProposalStatus.ACCEPTED,
          serviceOffered: "Marketing",
          clientSegment: "SaaS",
          tone: "PROFESSIONAL",
          styleSnapshot: { visualStyle: "MODERN" },
          generatedContent: { introduction: "Intro" },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "p2",
          title: "Proposta B",
          clientName: "Cliente B",
          status: ProposalStatus.READY,
          serviceOffered: "Design",
          clientSegment: "Varejo",
          tone: "FRIENDLY",
          styleSnapshot: { visualStyle: "MINIMAL" },
          generatedContent: { introduction: "Intro" },
          createdAt: new Date(),
          updatedAt: new Date(Date.now() - 86400000 * 60),
        },
      ],
    },
  };

  const service = new ProposalReferenceService(prisma as never);

  it("prioritizes accepted proposals", async () => {
    const results = await service.getRecommendations({
      userId: "u1",
      serviceOffered: "Marketing",
      clientSegment: "SaaS",
      tone: "PROFESSIONAL",
      template: "MODERN",
    });

    expect(results[0]?.id).toBe("p1");
    expect(results[0]?.score).toBeGreaterThan(results[1]?.score ?? 0);
  });

  it("builds reference summary without client-specific leakage instructions", () => {
    const summary = service.buildReferenceSummary({
      title: "Proposta A",
      serviceOffered: "Marketing",
      tone: "PROFESSIONAL",
      generatedContent: {
        introduction: "Texto de introducao",
        proposedSolution: "Solucao proposta",
      },
    });

    expect(summary).toContain("Proposta A");
    expect(summary).toContain("Marketing");
  });
});
