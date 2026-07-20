export type VisualStyleId = "MINIMAL" | "MODERN" | "PREMIUM" | "BOLD";

export type ProposalTemplate = {
  id: VisualStyleId;
  name: string;
  description: string;
  badge: string;
};

export const PROPOSAL_TEMPLATES: ProposalTemplate[] = [
  {
    id: "MINIMAL",
    name: "Minimal",
    description: "Layout limpo, tipografia leve e foco total no conteudo.",
    badge: "Classico",
  },
  {
    id: "MODERN",
    name: "Moderno",
    description: "Cabecalho com destaque, linhas de acento e hierarquia clara.",
    badge: "Popular",
  },
  {
    id: "PREMIUM",
    name: "Premium",
    description: "Espacamento generoso, titulos elegantes e sensacao consultiva.",
    badge: "Sofisticado",
  },
  {
    id: "BOLD",
    name: "Marcante",
    description: "Tipografia forte, blocos contrastantes e visual de impacto.",
    badge: "Destaque",
  },
];

export const PROPOSAL_SECTION_LABELS: Record<string, string> = {
  introduction: "Introducao",
  clientContext: "Contexto do cliente",
  problem: "Problema",
  proposedSolution: "Solucao proposta",
  nextSteps: "Proximos passos",
  closing: "Encerramento",
};

export const PROPOSAL_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Rascunho",
  GENERATING: "Gerando",
  READY: "Pronta",
  SENT: "Enviada",
  VIEWED: "Visualizada",
  ACCEPTED: "Aceita",
  REJECTED: "Recusada",
  EXPIRED: "Expirada",
  ARCHIVED: "Arquivada",
};

export const FREE_PROPOSAL_LIMIT = 3;
