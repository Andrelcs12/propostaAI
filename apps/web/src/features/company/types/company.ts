export type ProfileType = "COMPANY" | "INDIVIDUAL";
export type ProposalTone =
  | "PROFESSIONAL"
  | "DIRECT"
  | "PERSUASIVE"
  | "FRIENDLY"
  | "PREMIUM";
export type BillingType = "FIXED" | "HOURLY" | "MONTHLY" | "PROJECT";
export type CompanyVisualPreference = "LIGHT" | "DARK" | "AUTO";
export type CompanyFontPreference = "INTER" | "MANROPE" | "POPPINS" | "DM_SANS";
export type CompanyVisualStyle = "MINIMAL" | "MODERN" | "PREMIUM" | "BOLD";
export type CompanyBorderRadius = "SMALL" | "MEDIUM" | "LARGE";

export type Company = {
  id: string;
  userId: string;
  profileType: ProfileType;
  name: string;
  tradeName: string | null;
  description: string | null;
  segment: string | null;
  website: string | null;
  commercialEmail: string | null;
  whatsapp: string | null;
  instagram: string | null;
  city: string | null;
  state: string | null;
  logoUrl: string | null;
  lightLogoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  visualPreference: CompanyVisualPreference;
  fontPreference: CompanyFontPreference;
  visualStyle: CompanyVisualStyle;
  borderRadius: CompanyBorderRadius;
  responsibleName: string | null;
  responsibleRole: string | null;
  document: string | null;
  address: string | null;
  presentationText: string | null;
  footerText: string | null;
  contactText: string | null;
  defaultValidityDays: number;
  defaultDeliveryTime: string | null;
  defaultPaymentConditions: string | null;
  defaultCurrency: string;
  defaultBillingType: BillingType;
  defaultIntroMessage: string | null;
  defaultClosingMessage: string | null;
  defaultTerms: string | null;
  showDetailedValues: boolean;
  showDiscount: boolean;
  showContactData: boolean;
  showSignature: boolean;
  defaultTone: ProposalTone;
  onboardingStep: number;
  onboardingDone: boolean;
  onboardingCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CompanyStatus = {
  company: Company | null;
  onboardingDone: boolean;
  onboardingStep: number;
};

export const PROPOSAL_TONE_OPTIONS: Array<{
  value: ProposalTone;
  label: string;
  description: string;
}> = [
  {
    value: "PROFESSIONAL",
    label: "Profissional",
    description: "Claro, confiavel, estruturado e corporativo.",
  },
  {
    value: "DIRECT",
    label: "Direto",
    description: "Objetivo, curto e sem excesso de linguagem promocional.",
  },
  {
    value: "PERSUASIVE",
    label: "Persuasivo",
    description: "Focado em valor, beneficios, transformacao e fechamento.",
  },
  {
    value: "FRIENDLY",
    label: "Amigavel",
    description: "Proximo, natural e acessivel.",
  },
  {
    value: "PREMIUM",
    label: "Premium",
    description: "Sofisticado, estrategico e com percepcao de alto valor.",
  },
];

export const PROFILE_TYPE_OPTIONS: Array<{
  value: ProfileType;
  label: string;
  description: string;
}> = [
  {
    value: "COMPANY",
    label: "Empresa",
    description: "Para times, agencias e negocios com CNPJ.",
  },
  {
    value: "INDIVIDUAL",
    label: "Profissional autonomo",
    description: "Para freelancers, consultores e prestadores individuais.",
  },
];
