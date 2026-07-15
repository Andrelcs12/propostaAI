export type CompanyVisualPreference = "LIGHT" | "DARK" | "AUTO";
export type CompanyFontPreference = "INTER" | "MANROPE" | "POPPINS" | "DM_SANS";
export type CompanyVisualStyle = "MINIMAL" | "MODERN" | "PREMIUM" | "BOLD";
export type CompanyBorderRadius = "SMALL" | "MEDIUM" | "LARGE";

export type Company = {
  id: string;
  userId: string;
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
  onboardingStep: number;
  onboardingDone: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CompanyStatus = {
  company: Company | null;
  onboardingDone: boolean;
  onboardingStep: number;
};
