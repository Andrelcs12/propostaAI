import { z } from "zod";

export const companyCandidateSchema = z.object({
  name: z.string().min(1),
  website: z.string().optional(),
  location: z.string().optional(),
  segment: z.string().optional(),
  description: z.string().optional(),
  sourceUrl: z.string().optional(),
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
});

export const companySearchResponseSchema = z.object({
  candidates: z.array(companyCandidateSchema).max(5),
});

export const companyAnalysisSchema = z.object({
  officialName: z.string().optional(),
  tradeName: z.string().optional(),
  website: z.string().optional(),
  segment: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  productsOrServices: z.array(z.string()).default([]),
  targetAudience: z.string().optional(),
  positioning: z.string().optional(),
  publicDifferentials: z.array(z.string()).default([]),
  possibleOpportunities: z.array(z.string()).default([]),
  possibleChallenges: z.array(z.string()).default([]),
  brandTone: z.string().optional(),
  sources: z
    .array(
      z.object({
        title: z.string(),
        url: z.string(),
      }),
    )
    .default([]),
  researchedAt: z.string(),
});

export type CompanyCandidate = z.infer<typeof companyCandidateSchema>;
export type CompanySearchResponse = z.infer<typeof companySearchResponseSchema>;
export type CompanyAnalysis = z.infer<typeof companyAnalysisSchema>;

export const generatedProposalContentSchema = z.object({
  title: z.string().min(1),
  introduction: z.string().min(1),
  clientContext: z.string().min(1),
  problem: z.string().min(1),
  proposedSolution: z.string().min(1),
  scope: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
    }),
  ),
  deliverables: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
    }),
  ),
  timeline: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      duration: z.string().optional(),
      description: z.string().optional(),
    }),
  ),
  investment: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      amount: z.number(),
      description: z.string().optional(),
    }),
  ),
  differentials: z.array(z.string()),
  nextSteps: z.string(),
  closing: z.string(),
});

export type GeneratedProposalContent = z.infer<
  typeof generatedProposalContentSchema
>;
