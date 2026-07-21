import { z } from "zod";
import { isValidBusinessSegment } from "@novely/shared";

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

export const listItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Informe o titulo."),
  description: optionalText(500),
});

export const timelineItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(1, "Informe o titulo."),
  duration: optionalText(80),
  description: optionalText(500),
  order: z.number().int().min(0),
});

export const investmentItemSchema = z.object({
  id: z.string().min(1),
  label: z.string().trim().min(1, "Informe o titulo."),
  amount: z.coerce.number().min(0, "Valor nao pode ser negativo."),
  description: optionalText(500),
  order: z.number().int().min(0),
});

export const createProposalSchema = z.object({
  clientName: z.string().trim().min(2, "Informe o nome do cliente."),
  clientContactName: optionalText(120),
  clientEmail: optionalEmail,
  clientPhone: optionalText(40),
  clientSegment: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) => !value || isValidBusinessSegment(value),
      "Selecione um segmento valido.",
    ),
  clientWebsite: optionalUrl,
  clientDescription: optionalText(1200),
  clientProblem: optionalText(1200),
  title: z.string().trim().min(2, "Informe o titulo da proposta."),
  serviceOffered: optionalText(300),
  objective: optionalText(1200),
  scope: z.array(listItemSchema),
  deliverables: z.array(listItemSchema),
  timeline: z.array(timelineItemSchema),
  investment: z.array(investmentItemSchema),
  paymentConditions: optionalText(600),
  validityDate: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (value) =>
        !value ||
        (new Date(value).toString() !== "Invalid Date" &&
          new Date(value) >= new Date(new Date().toDateString())),
      "A validade nao pode estar no passado.",
    ),
  observations: optionalText(1200),
  differentials: z.array(z.string().trim().min(1)),
  nextSteps: optionalText(1200),
  terms: optionalText(1200),
  tone: z
    .enum(["PROFESSIONAL", "DIRECT", "PERSUASIVE", "FRIENDLY", "PREMIUM"])
    .optional(),
});

export type CreateProposalInput = z.infer<typeof createProposalSchema>;

export function createEmptyListItem(title = "") {
  return {
    id: crypto.randomUUID(),
    title,
    description: "",
  };
}

export function createEmptyTimelineItem(order: number) {
  return {
    id: crypto.randomUUID(),
    title: "",
    duration: "",
    description: "",
    order,
  };
}

export function createEmptyInvestmentItem(order: number) {
  return {
    id: crypto.randomUUID(),
    label: "",
    amount: 0,
    description: "",
    order,
  };
}
