export type BillingConfig = {
  enabled: boolean;
  mode: "structure-only" | "live";
  freeProposalLimit: number;
  priceInCents?: number;
  priceLabel?: string;
};

export type BillingUsage = {
  plan: "free" | "pro";
  proposalsUsed: number;
  proposalsLimit: number | null;
  proposalsRemaining: number | null;
  canCreateProposal: boolean;
  aiConfigured: boolean;
  subscriptionStatus?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  reason?: string;
  byStatus: Record<string, number>;
};

export type BillingStatus = {
  plan: "FREE" | "PRO";
  subscriptionStatus?: string;
  usage: number;
  limit: number | null;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
};
