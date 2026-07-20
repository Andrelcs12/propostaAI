import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Use no maximo ${max} caracteres.`)
    .optional()
    .or(z.literal(""));

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine(
    (value) => !value || /^https?:\/\/.+/i.test(value),
    "Informe uma URL com http:// ou https://.",
  );

const optionalEmail = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine(
    (value) => !value || z.string().email().safeParse(value).success,
    "Informe um e-mail valido.",
  );

export const hexColorSchema = z
  .string()
  .regex(
    /^#[0-9A-Fa-f]{6}$/,
    "Use uma cor hexadecimal valida. Exemplo: #0F766E",
  );

export const profileTypeSchema = z.object({
  profileType: z.enum(["COMPANY", "INDIVIDUAL"]),
});

export const companyBasicSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe o nome.")
    .max(120, "Use no maximo 120 caracteres."),
  tradeName: optionalText(120),
  description: optionalText(300),
  segment: optionalText(80),
  website: optionalUrl,
  commercialEmail: optionalEmail,
  whatsapp: optionalText(40),
  instagram: optionalText(80),
  city: optionalText(80),
  state: z
    .string()
    .trim()
    .length(2, "Use a UF com 2 letras.")
    .optional()
    .or(z.literal("")),
});

export const companyBrandSchema = z.object({
  logoUrl: optionalUrl,
  lightLogoUrl: optionalUrl,
  primaryColor: hexColorSchema,
  secondaryColor: hexColorSchema,
  accentColor: hexColorSchema,
  backgroundColor: hexColorSchema,
  surfaceColor: hexColorSchema,
  textColor: hexColorSchema,
  visualPreference: z.enum(["LIGHT", "DARK", "AUTO"]),
  fontPreference: z.enum(["INTER", "MANROPE", "POPPINS", "DM_SANS"]),
  visualStyle: z.enum(["MINIMAL", "MODERN", "PREMIUM", "BOLD"]),
  borderRadius: z.enum(["SMALL", "MEDIUM", "LARGE"]),
});

export const companyIdentitySchema = z.object({
  tradeName: optionalText(120),
  presentationText: optionalText(1200),
  responsibleName: optionalText(120),
  responsibleRole: optionalText(120),
  contactText: optionalText(600),
  showContactData: z.boolean(),
  showSignature: z.boolean(),
});

export const companyDefaultsSchema = z.object({
  defaultValidityDays: z.coerce
    .number()
    .int()
    .min(1, "Informe pelo menos 1 dia.")
    .max(365, "Use no maximo 365 dias."),
  defaultDeliveryTime: optionalText(120),
  defaultPaymentConditions: optionalText(600),
  defaultCurrency: z
    .string()
    .trim()
    .length(3, "Use o codigo da moeda com 3 letras."),
  defaultBillingType: z.enum(["FIXED", "HOURLY", "MONTHLY", "PROJECT"]),
  defaultIntroMessage: optionalText(1200),
  defaultClosingMessage: optionalText(600),
  defaultTerms: optionalText(1200),
  showDetailedValues: z.boolean(),
  showDiscount: z.boolean(),
  defaultTone: z.enum([
    "PROFESSIONAL",
    "DIRECT",
    "PERSUASIVE",
    "FRIENDLY",
    "PREMIUM",
  ]),
});

export const companyCommercialSchema = z.object({
  responsibleName: optionalText(120),
  responsibleRole: optionalText(120),
  document: optionalText(32),
  address: optionalText(240),
  presentationText: optionalText(1200),
  footerText: optionalText(600),
  contactText: optionalText(600),
});

export type ProfileTypeInput = z.infer<typeof profileTypeSchema>;
export type CompanyBasicInput = z.infer<typeof companyBasicSchema>;
export type CompanyBrandInput = z.infer<typeof companyBrandSchema>;
export type CompanyIdentityInput = z.infer<typeof companyIdentitySchema>;
export type CompanyDefaultsInput = z.infer<typeof companyDefaultsSchema>;
export type CompanyCommercialInput = z.infer<typeof companyCommercialSchema>;
