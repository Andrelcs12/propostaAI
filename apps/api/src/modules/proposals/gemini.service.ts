import {

  BadRequestException,

  Injectable,

  ServiceUnavailableException,

} from "@nestjs/common";

import { ConfigService } from "@nestjs/config";

import { GoogleGenAI } from "@google/genai";

import type { ProposalTone } from "../../generated/prisma/enums";

import {

  companyAnalysisSchema,

  companySearchResponseSchema,

  generatedProposalContentSchema,

  type CompanyAnalysis,

  type GeneratedProposalContent,

} from "./gemini.schemas";



export type { GeneratedProposalContent };



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

  clientCity?: string | null;

  clientState?: string | null;

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

  companyResearch?: CompanyAnalysis | null;

  referenceSummary?: string | null;

};



type SearchCompaniesInput = {

  name: string;

  city?: string;

  state?: string;

  website?: string;

};



type ResearchCompanyInput = {

  name: string;

  website?: string;

  sourceUrls?: string[];

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



const GENERATION_PROMPT_VERSION = "2026-07-20-v1";



@Injectable()

export class GeminiService {

  private readonly client: GoogleGenAI | null;

  private readonly model: string;

  private readonly searchEnabled: boolean;



  constructor(private readonly configService: ConfigService) {

    const apiKey = this.configService.get<string>("GEMINI_API_KEY")?.trim();

    this.model =

      this.configService.get<string>("GEMINI_MODEL")?.trim() ||

      "gemini-3.5-flash";

    this.searchEnabled =

      this.configService.get<string>("GEMINI_SEARCH_ENABLED")?.trim() !==

      "false";

    this.client = apiKey ? new GoogleGenAI({ apiKey }) : null;

  }



  isConfigured() {

    return Boolean(this.client);

  }



  isSearchEnabled() {

    return this.searchEnabled && this.isConfigured();

  }



  getModelName() {

    return this.model;

  }



  getPromptVersion() {

    return GENERATION_PROMPT_VERSION;

  }



  async generateProposal(input: GenerateInput): Promise<GeneratedProposalContent> {

    const prompt = this.buildProposalPrompt(input);

    const text = await this.generateJsonText(prompt, { useSearch: false });

    return this.parseGeneratedContent(text, input.section);

  }



  async searchCompanies(input: SearchCompaniesInput) {

    if (!this.isSearchEnabled()) {

      return { candidates: [] };

    }



    const prompt = [

      "Voce e um assistente de pesquisa de empresas usando apenas informacoes publicas.",

      "Busque empresas reais que correspondam ao nome informado.",

      "Retorne de 3 a 5 candidatos quando houver ambiguidade.",

      "Nao invente empresas. Se nao houver fonte confiavel, retorne candidates vazio.",

      "Cada candidato deve incluir confidence HIGH, MEDIUM ou LOW.",

      'Schema JSON: {"candidates":[{"name":"string","website":"string?","location":"string?","segment":"string?","description":"string?","sourceUrl":"string?","confidence":"HIGH|MEDIUM|LOW"}]}',

      "Consulta:",

      JSON.stringify(input),

    ].join("\n");



    try {

      const text = await this.generateJsonText(prompt, { useSearch: true });

      const parsed = companySearchResponseSchema.safeParse(JSON.parse(text));

      return parsed.success ? parsed.data : { candidates: [] };

    } catch {

      return { candidates: [] };

    }

  }



  async researchCompany(input: ResearchCompanyInput): Promise<CompanyAnalysis> {

    if (!this.isSearchEnabled()) {

      throw new ServiceUnavailableException(

        "Pesquisa de empresas indisponivel. Preencha os dados manualmente.",

      );

    }



    const prompt = [

      "Voce e um analista de inteligencia comercial B2B.",

      "Use apenas informacoes publicas encontradas na web.",

      "possibleOpportunities e possibleChallenges devem ser hipoteses, nunca fatos internos confirmados.",

      "Inclua sources com title e url para cada fonte relevante.",

      "Nao invente dados sem evidencia publica.",

      "Schema JSON:",

      JSON.stringify({

        officialName: "string?",

        tradeName: "string?",

        website: "string?",

        segment: "string?",

        location: "string?",

        summary: "string?",

        productsOrServices: ["string"],

        targetAudience: "string?",

        positioning: "string?",

        publicDifferentials: ["string"],

        possibleOpportunities: ["string"],

        possibleChallenges: ["string"],

        brandTone: "string?",

        sources: [{ title: "string", url: "string" }],

        researchedAt: "ISO date string",

      }),

      "Empresa:",

      JSON.stringify(input),

    ].join("\n");



    const text = await this.generateJsonText(prompt, { useSearch: true });

    const parsed = companyAnalysisSchema.safeParse(JSON.parse(text));



    if (!parsed.success) {

      throw new BadRequestException(

        "Nao foi possivel analisar a empresa. Tente novamente ou preencha manualmente.",

      );

    }



    return {

      ...parsed.data,

      researchedAt: parsed.data.researchedAt || new Date().toISOString(),

    };

  }



  async generateProposalContent(input: GenerateInput) {

    return this.generateProposal(input);

  }



  private async generateJsonText(

    prompt: string,

    options: { useSearch: boolean },

  ) {

    if (!this.client) {

      throw new ServiceUnavailableException(

        "Geracao com IA indisponivel. Configure GEMINI_API_KEY no backend.",

      );

    }



    const controller = new AbortController();

    const timeout = setTimeout(() => controller.abort(), 60_000);



    try {

      const response = await this.client.models.generateContent({

        model: this.model,

        contents: prompt,

        config: {

          temperature: 0.7,

          responseMimeType: "application/json",

          ...(options.useSearch && this.searchEnabled

            ? { tools: [{ googleSearch: {} }] }

            : {}),

          abortSignal: controller.signal,

        },

      });



      const text = response.text?.trim();



      if (!text) {

        throw new BadRequestException(

          "A IA retornou uma resposta vazia. Tente novamente.",

        );

      }



      return text;

    } catch (error) {

      if (

        error instanceof BadRequestException ||

        error instanceof ServiceUnavailableException

      ) {

        throw error;

      }



      if (error instanceof Error && error.name === "AbortError") {

        throw new ServiceUnavailableException(

          "A operacao demorou demais. Tente novamente.",

        );

      }



      throw new ServiceUnavailableException(

        "Falha ao comunicar com o provedor de IA.",

      );

    } finally {

      clearTimeout(timeout);

    }

  }



  private buildProposalPrompt(input: GenerateInput) {

    const sectionInstruction = input.section

      ? `Regenere apenas a secao "${input.section}" mantendo coerencia com o restante. Retorne o JSON completo atualizado.`

      : "Gere o conteudo completo da proposta.";



    const referenceRules = input.referenceSummary

      ? [

          "Use a proposta de referencia apenas para estrutura, nivel de detalhamento, estilo, organizacao de escopo, investimento e cronograma.",

          "PROIBIDO reutilizar nome de cliente anterior, contatos, endereco, CPF/CNPJ, valores, datas, links, condicoes especificas ou dados confidenciais.",

          "Nao copie paragrafos inteiros da referencia.",

          `Referencia resumida: ${input.referenceSummary}`,

        ]

      : [];



    return [

      "Voce e um redator especialista em propostas comerciais B2B em portugues do Brasil.",

      sectionInstruction,

      `Tom desejado: ${TONE_GUIDANCE[input.tone]}`,

      ...referenceRules,

      "Regras:",

      "- Nao invente numeros, prazos, valores ou condicoes nao informados.",

      "- Use apenas dados fornecidos no contexto.",

      "- Retorne JSON valido.",

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

            city: input.clientCity,

            state: input.clientState,

            description: input.clientDescription,

            problem: input.clientProblem,

          },

          companyResearch: input.companyResearch ?? null,

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



  private parseGeneratedContent(text: string, section?: string) {

    try {

      return generatedProposalContentSchema.parse(JSON.parse(text));

    } catch {

      throw new BadRequestException(

        section

          ? `Nao foi possivel regenerar a secao "${section}". Tente novamente.`

          : "A IA retornou um formato invalido. Tente novamente.",

      );

    }

  }

}


