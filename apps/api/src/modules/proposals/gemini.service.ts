import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { ProposalTone } from "../../generated/prisma/enums";

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

type GenerateInput = {
  tone: ProposalTone;
  sender: Record<string, unknown>;
  style: Record<string, unknown>;
  clientName: string;
  clientContactName?: string | null;
  clientEmail?: string | null;
  clientPhone?: string | null;
  clientSegment?: string | null;
  clientWebsite?: string | null;
  clientDescription?: string | null;
  clientProblem?: string | null;
  title: string;
  serviceOffered?: string | null;
  objective?: string | null;
  scope: unknown;
  deliverables: unknown;
  timeline: unknown;
  investment: unknown;
  paymentConditions?: string | null;
  validityDate?: string | null;
  observations?: string | null;
  differentials: unknown;
  nextSteps?: string | null;
  terms?: string | null;
  section?: string;
  existingContent?: GeneratedProposalContent | null;
};

const TONE_GUIDANCE: Record<ProposalTone, string> = {
  PROFESSIONAL:
    "Tom claro, confiavel, estruturado e corporativo. Linguagem formal moderada.",
  DIRECT:
    "Tom objetivo, curto e direto. Evite linguagem promocional excessiva.",
  PERSUASIVE:
    "Tom focado em valor, beneficios, transformacao e fechamento comercial.",
  FRIENDLY: "Tom proximo, natural e acessivel, mantendo profissionalismo.",
  PREMIUM:
    "Tom sofisticado, estrategico e com percepcao de alto valor.",
};

const GENERATED_SCHEMA = `{
  "title": "string",
  "introduction": "string",
  "clientContext": "string",
  "problem": "string",
  "proposedSolution": "string",
  "scope": [{"id":"string","title":"string","description":"string"}],
  "deliverables": [{"id":"string","title":"string","description":"string"}],
  "timeline": [{"id":"string","title":"string","duration":"string","description":"string"}],
  "investment": [{"id":"string","label":"string","amount":number,"description":"string"}],
  "differentials": ["string"],
  "nextSteps": "string",
  "closing": "string"
}`;

@Injectable()
export class GeminiService {
  private readonly apiKey: string | undefined;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>("GEMINI_API_KEY")?.trim();
    this.model =
      this.configService.get<string>("GEMINI_MODEL")?.trim() ||
      "gemini-2.0-flash";
  }

  isConfigured() {
    return Boolean(this.apiKey);
  }

  async generateProposalContent(
    input: GenerateInput,
  ): Promise<GeneratedProposalContent> {
    if (!this.apiKey) {
      throw new ServiceUnavailableException(
        "Geracao com IA indisponivel. Configure GEMINI_API_KEY no backend.",
      );
    }

    const prompt = this.buildPrompt(input);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: "application/json",
            },
          }),
        },
      );

      if (!response.ok) {
        throw new ServiceUnavailableException(
          "Nao foi possivel gerar o conteudo da proposta. Tente novamente.",
        );
      }

      const payload = (await response.json()) as {
        candidates?: Array<{
          content?: { parts?: Array<{ text?: string }> };
        }>;
      };

      const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new BadRequestException(
          "A IA retornou uma resposta vazia. Tente novamente.",
        );
      }

      return this.parseGeneratedContent(text, input.section);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error instanceof ServiceUnavailableException) {
        throw error;
      }

      if (error instanceof Error && error.name === "AbortError") {
        throw new ServiceUnavailableException(
          "A geracao demorou demais. Tente novamente.",
        );
      }

      throw new ServiceUnavailableException(
        "Falha ao comunicar com o provedor de IA.",
      );
    } finally {
      clearTimeout(timeout);
    }
  }

  private buildPrompt(input: GenerateInput) {
    const sectionInstruction = input.section
      ? `Regenere apenas a secao "${input.section}" mantendo coerencia com o restante. Retorne o JSON completo atualizado.`
      : "Gere o conteudo completo da proposta.";

    return [
      "Voce e um redator especialista em propostas comerciais B2B em portugues do Brasil.",
      sectionInstruction,
      `Tom desejado: ${TONE_GUIDANCE[input.tone]}`,
      "Regras:",
      "- Nao invente numeros, prazos, valores ou condicoes nao informados.",
      "- Use apenas dados fornecidos no contexto.",
      "- Retorne JSON valido seguindo exatamente o schema abaixo.",
      "- IDs devem ser strings curtas unicas.",
      "- Valores de investment.amount devem ser numeros (nao strings).",
      `- Schema: ${GENERATED_SCHEMA}`,
      "Contexto:",
      JSON.stringify(
        {
          sender: input.sender,
          style: input.style,
          client: {
            name: input.clientName,
            contactName: input.clientContactName,
            email: input.clientEmail,
            phone: input.clientPhone,
            segment: input.clientSegment,
            website: input.clientWebsite,
            description: input.clientDescription,
            problem: input.clientProblem,
          },
          proposal: {
            title: input.title,
            serviceOffered: input.serviceOffered,
            objective: input.objective,
            scope: input.scope,
            deliverables: input.deliverables,
            timeline: input.timeline,
            investment: input.investment,
            paymentConditions: input.paymentConditions,
            validityDate: input.validityDate,
            observations: input.observations,
            differentials: input.differentials,
            nextSteps: input.nextSteps,
            terms: input.terms,
          },
          existingContent: input.existingContent ?? null,
        },
        null,
        2,
      ),
    ].join("\n");
  }

  private parseGeneratedContent(
    text: string,
    section?: string,
  ): GeneratedProposalContent {
    try {
      const parsed = JSON.parse(text) as GeneratedProposalContent;

      if (!parsed.title || !parsed.introduction || !parsed.proposedSolution) {
        throw new Error("Missing required fields");
      }

      parsed.scope = Array.isArray(parsed.scope) ? parsed.scope : [];
      parsed.deliverables = Array.isArray(parsed.deliverables)
        ? parsed.deliverables
        : [];
      parsed.timeline = Array.isArray(parsed.timeline) ? parsed.timeline : [];
      parsed.investment = Array.isArray(parsed.investment)
        ? parsed.investment
        : [];
      parsed.differentials = Array.isArray(parsed.differentials)
        ? parsed.differentials
        : [];

      return parsed;
    } catch {
      throw new BadRequestException(
        section
          ? `Nao foi possivel regenerar a secao "${section}". Tente novamente.`
          : "A IA retornou um formato invalido. Tente novamente.",
      );
    }
  }
}
