import { apiFetch } from "@/lib/api/client";

export type CompanyCandidate = {
  name: string;
  website?: string;
  location?: string;
  segment?: string;
  description?: string;
  sourceUrl?: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
};

export type CompanyAnalysis = {
  officialName?: string;
  tradeName?: string;
  website?: string;
  segment?: string;
  location?: string;
  summary?: string;
  productsOrServices: string[];
  targetAudience?: string;
  positioning?: string;
  publicDifferentials: string[];
  possibleOpportunities: string[];
  possibleChallenges: string[];
  brandTone?: string;
  sources: Array<{ title: string; url: string }>;
  researchedAt: string;
};

export function searchCompanies(
  accessToken: string,
  input: {
    name: string;
    city?: string;
    state?: string;
    website?: string;
  },
) {
  return apiFetch<{ candidates: CompanyCandidate[] }>(
    "/api/company-research/search",
    {
      method: "POST",
      accessToken,
      body: JSON.stringify(input),
    },
  );
}

export function analyzeCompany(
  accessToken: string,
  input: { name: string; website?: string; sourceUrls?: string[] },
) {
  return apiFetch<CompanyAnalysis>("/api/company-research/analyze", {
    method: "POST",
    accessToken,
    body: JSON.stringify(input),
  });
}
