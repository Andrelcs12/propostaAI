export type ProposalStatus =
  | "DRAFT"
  | "GENERATING"
  | "READY"
  | "SENT"
  | "VIEWED"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"
  | "ARCHIVED";

export type ProposalTone =
  | "PROFESSIONAL"
  | "DIRECT"
  | "PERSUASIVE"
  | "FRIENDLY"
  | "PREMIUM";

export type ProposalListItem = {
  id: string;
  title: string;
  description?: string;
};

export type ProposalTimelineItem = {
  id: string;
  title: string;
  duration?: string;
  description?: string;
  order: number;
};

export type ProposalInvestmentItem = {
  id: string;
  label: string;
  amount: number;
  description?: string;
  order: number;
};

export type GeneratedProposalContent = {
  title: string;
  introduction: string;
  clientContext: string;
  problem: string;
  proposedSolution: string;
  scope: Array<{ id: string; title: string; description: string }>;
  deliverables: Array<{ id: string; title: string; description: string }>;
  timeline: Array<{
    id: string;
    title: string;
    duration: string;
    description: string;
  }>;
  investment: Array<{
    id: string;
    label: string;
    amount: number;
    description: string;
  }>;
  differentials: string[];
  nextSteps: string;
  closing: string;
};

export type SenderSnapshot = {
  profileType: string;
  name: string;
  displayName: string;
  description?: string | null;
  segment?: string | null;
  website?: string | null;
  commercialEmail?: string | null;
  whatsapp?: string | null;
  logoUrl?: string | null;
  responsibleName?: string | null;
  responsibleRole?: string | null;
  presentationText?: string | null;
  contactText?: string | null;
  showContactData: boolean;
  showSignature: boolean;
  defaultIntroMessage?: string | null;
  defaultClosingMessage?: string | null;
  defaultTerms?: string | null;
  document?: string | null;
  address?: string | null;
  footerText?: string | null;
  showDetailedValues: boolean;
  showDiscount: boolean;
};

export type StyleSnapshot = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  visualPreference: string;
  fontPreference: string;
  visualStyle: string;
  borderRadius: string;
  logoUrl?: string | null;
};

export type Proposal = {
  id: string;
  userId: string;
  companyId: string;
  status: ProposalStatus;
  tone: ProposalTone;
  clientName: string;
  clientContactName: string | null;
  clientEmail: string | null;
  clientPhone: string | null;
  clientSegment: string | null;
  clientWebsite: string | null;
  clientDescription: string | null;
  clientProblem: string | null;
  title: string;
  serviceOffered: string | null;
  objective: string | null;
  scope: ProposalListItem[];
  deliverables: ProposalListItem[];
  timeline: ProposalTimelineItem[];
  investment: ProposalInvestmentItem[];
  paymentConditions: string | null;
  validityDate: string | null;
  observations: string | null;
  differentials: string[];
  nextSteps: string | null;
  terms: string | null;
  generatedContent: GeneratedProposalContent | null;
  senderSnapshot: SenderSnapshot;
  styleSnapshot: StyleSnapshot;
  publicToken: string | null;
  publicEnabled: boolean;
  publishedAt: string | null;
  firstViewedAt: string | null;
  lastViewedAt: string | null;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
};

export type PublicProposal = {
  clientName: string;
  clientContactName: string | null;
  title: string;
  validityDate: string | null;
  paymentConditions: string | null;
  terms: string | null;
  generatedContent: GeneratedProposalContent;
  senderSnapshot: SenderSnapshot;
  styleSnapshot: StyleSnapshot;
  status: ProposalStatus;
};

export type PublishProposalResult = {
  proposal: Proposal;
  shareUrl: string;
};

export type ProposalSummary = {
  id: string;
  title: string;
  clientName: string;
  status: ProposalStatus;
  tone: ProposalTone;
  validityDate: string | null;
  publicEnabled: boolean;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
