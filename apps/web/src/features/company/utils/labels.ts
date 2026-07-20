import type {
  BillingType,
  CompanyBorderRadius,
  CompanyFontPreference,
  CompanyVisualPreference,
  CompanyVisualStyle,
  ProfileType,
  ProposalTone,
} from "@/features/company/types/company";
import { PROPOSAL_TEMPLATES } from "@/config/templates";

export const PROFILE_TYPE_LABELS: Record<ProfileType, string> = {
  COMPANY: "Empresa",
  INDIVIDUAL: "Profissional autonomo",
};

export const PROPOSAL_TONE_LABELS: Record<ProposalTone, string> = {
  PROFESSIONAL: "Profissional",
  DIRECT: "Direto",
  PERSUASIVE: "Persuasivo",
  FRIENDLY: "Amigavel",
  PREMIUM: "Premium",
};

export const BILLING_TYPE_LABELS: Record<BillingType, string> = {
  PROJECT: "Por projeto",
  FIXED: "Valor fixo",
  HOURLY: "Por hora",
  MONTHLY: "Mensal (recorrente)",
};

export const FONT_PREFERENCE_LABELS: Record<CompanyFontPreference, string> = {
  INTER: "Inter",
  MANROPE: "Manrope",
  POPPINS: "Poppins",
  DM_SANS: "DM Sans",
};

export const VISUAL_STYLE_LABELS: Record<CompanyVisualStyle, string> = {
  MINIMAL: "Minimal",
  MODERN: "Moderno",
  PREMIUM: "Premium",
  BOLD: "Marcante",
};

export const VISUAL_PREFERENCE_LABELS: Record<CompanyVisualPreference, string> = {
  LIGHT: "Clara",
  DARK: "Escura",
  AUTO: "Automatica",
};

export const BORDER_RADIUS_LABELS: Record<CompanyBorderRadius, string> = {
  SMALL: "Pequeno",
  MEDIUM: "Medio",
  LARGE: "Grande",
};

export function getVisualStyleLabel(style: string) {
  return VISUAL_STYLE_LABELS[style as CompanyVisualStyle] ?? style;
}

export function getFontPreferenceLabel(font: string) {
  return FONT_PREFERENCE_LABELS[font as CompanyFontPreference] ?? font.replace("_", " ");
}

export function getProposalToneLabel(tone: string) {
  return PROPOSAL_TONE_LABELS[tone as ProposalTone] ?? tone;
}

export function getProfileTypeLabel(profile: string) {
  return PROFILE_TYPE_LABELS[profile as ProfileType] ?? profile;
}

export function getBillingTypeLabel(billing: string) {
  return BILLING_TYPE_LABELS[billing as BillingType] ?? billing;
}

export function getTemplateMeta(style: string) {
  return PROPOSAL_TEMPLATES.find((item) => item.id === style);
}

export function formatCurrency(value: number, currency = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}
