import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import type { Prisma } from "../../generated/prisma/client";
import { ProposalStatus } from "../../generated/prisma/enums";
import { PrismaService } from "../../database/prisma.service";
import { UsersService } from "../users/users.service";
import type { CreateProposalDto } from "./dto/create-proposal.dto";
import type { GenerateProposalDto } from "./dto/generate-proposal.dto";
import type { UpdateProposalDto } from "./dto/update-proposal.dto";
import { EntitlementsService } from "../billing/entitlements.service";
import {
  GeminiService,
  type GeneratedProposalContent,
} from "./gemini.service";
import type { CompanyAnalysis } from "./gemini.schemas";
import { ProposalReferenceService } from "./proposal-reference.service";
import { ProposalPdfService } from "./proposal-pdf.service";
import type { AcceptProposalDto } from "./dto/public-proposal.dto";
import type { RejectProposalDto } from "./dto/public-proposal.dto";
import { InMemoryRateLimiter } from "../../common/utils/rate-limiter";

@Injectable()
export class ProposalsService {
  private readonly publicActionLimiter = new InMemoryRateLimiter(20, 60_000);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly geminiService: GeminiService,
    private readonly proposalPdfService: ProposalPdfService,
    private readonly configService: ConfigService,
    private readonly entitlementsService: EntitlementsService,
    private readonly proposalReferenceService: ProposalReferenceService,
  ) {}

  async getReferences(authUser: SupabaseUser, proposalId?: string) {
    const user = await this.usersService.findOrSyncFromSupabase(authUser);

    let context = {
      serviceOffered: null as string | null,
      clientSegment: null as string | null,
      tone: null as string | null,
      template: null as string | null,
    };

    if (proposalId) {
      const proposal = await this.getById(authUser, proposalId);
      const style = proposal.styleSnapshot as { visualStyle?: string } | null;
      context = {
        serviceOffered: proposal.serviceOffered,
        clientSegment: proposal.clientSegment,
        tone: proposal.tone,
        template: style?.visualStyle ?? null,
      };
    }

    return this.proposalReferenceService.getRecommendations({
      userId: user.id,
      excludeProposalId: proposalId,
      ...context,
    });
  }

  async list(authUser: SupabaseUser) {
    const user = await this.usersService.findOrSyncFromSupabase(authUser);

    return this.prisma.proposal.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        clientName: true,
        status: true,
        tone: true,
        validityDate: true,
        publicEnabled: true,
        viewCount: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getById(authUser: SupabaseUser, proposalId: string) {
    const user = await this.usersService.findOrSyncFromSupabase(authUser);
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: proposalId },
    });

    if (!proposal) {
      throw new NotFoundException("Proposta nao encontrada.");
    }

    if (proposal.userId !== user.id) {
      throw new ForbiddenException("Voce nao tem acesso a esta proposta.");
    }

    return proposal;
  }

  async publish(authUser: SupabaseUser, proposalId: string) {
    const proposal = await this.getById(authUser, proposalId);

    if (!proposal.generatedContent) {
      throw new BadRequestException(
        "Gere o conteudo da proposta antes de compartilhar.",
      );
    }

    if (this.isExpired(proposal.validityDate)) {
      throw new BadRequestException(
        "Esta proposta esta expirada. Atualize a validade antes de compartilhar.",
      );
    }

    const publicToken =
      proposal.publicToken ?? this.generatePublicToken();

    const updated = await this.prisma.proposal.update({
      where: { id: proposalId },
      data: {
        publicToken,
        publicEnabled: true,
        publishedAt: proposal.publishedAt ?? new Date(),
        status:
          proposal.status === ProposalStatus.DRAFT ||
          proposal.status === ProposalStatus.READY
            ? ProposalStatus.SENT
            : proposal.status,
      },
    });

    return {
      proposal: updated,
      shareUrl: this.buildShareUrl(publicToken),
    };
  }

  async unpublish(authUser: SupabaseUser, proposalId: string) {
    await this.getById(authUser, proposalId);

    const updated = await this.prisma.proposal.update({
      where: { id: proposalId },
      data: {
        publicEnabled: false,
      },
    });

    return updated;
  }

  async exportPdf(authUser: SupabaseUser, proposalId: string) {
    const proposal = await this.getById(authUser, proposalId);

    if (!proposal.generatedContent) {
      throw new BadRequestException(
        "Gere o conteudo da proposta antes de exportar o PDF.",
      );
    }

    const publicToken =
      proposal.publicToken ??
      (
        await this.prisma.proposal.update({
          where: { id: proposalId },
          data: { publicToken: this.generatePublicToken() },
        })
      ).publicToken;

    if (!publicToken) {
      throw new BadRequestException("Nao foi possivel preparar a exportacao.");
    }

    const buffer = await this.proposalPdfService.generate({
      publicToken,
      clientName: proposal.clientName,
      title: proposal.title,
    });

    return {
      buffer,
      filename: this.proposalPdfService.buildFilename(
        proposal.clientName,
        proposal.title,
      ),
    };
  }

  async getByPublicToken(
    token: string,
    options: { allowPrint?: boolean; renderSecret?: string } = {},
  ) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { publicToken: token },
    });

    if (!proposal) {
      throw new NotFoundException("Proposta nao encontrada.");
    }

    const renderSecret =
      this.configService.get<string>("PDF_RENDER_SECRET")?.trim() ||
      "dev-render-secret";
    const isRenderMode =
      options.allowPrint && options.renderSecret === renderSecret;

    if (!proposal.publicEnabled && !isRenderMode) {
      throw new NotFoundException("Este link nao esta disponivel.");
    }

    if (!proposal.generatedContent) {
      throw new NotFoundException("Proposta indisponivel.");
    }

    if (this.isExpired(proposal.validityDate)) {
      if (proposal.status !== ProposalStatus.EXPIRED) {
        await this.prisma.proposal.update({
          where: { id: proposal.id },
          data: { status: ProposalStatus.EXPIRED },
        });
      }

      throw new NotFoundException("Esta proposta expirou.");
    }

    if (!isRenderMode) {
      await this.recordPublicView(proposal.id, proposal.status);
    }

    return this.toPublicProposal(proposal);
  }

  private async recordPublicView(
    proposalId: string,
    currentStatus: ProposalStatus,
  ) {
    const existing = await this.prisma.proposal.findUnique({
      where: { id: proposalId },
      select: { firstViewedAt: true },
    });
    const now = new Date();

    await this.prisma.proposal.update({
      where: { id: proposalId },
      data: {
        viewCount: { increment: 1 },
        firstViewedAt: existing?.firstViewedAt ?? now,
        lastViewedAt: now,
        status:
          currentStatus === ProposalStatus.SENT
            ? ProposalStatus.VIEWED
            : currentStatus,
      },
    });
  }

  private toPublicProposal(proposal: {
    clientName: string;
    clientContactName: string | null;
    title: string;
    validityDate: Date | null;
    paymentConditions: string | null;
    terms: string | null;
    generatedContent: Prisma.JsonValue;
    senderSnapshot: Prisma.JsonValue;
    styleSnapshot: Prisma.JsonValue;
    status: ProposalStatus;
    acceptedAt?: Date | null;
    acceptedByName?: string | null;
    acceptedByEmail?: string | null;
    rejectedAt?: Date | null;
    rejectionReason?: string | null;
    publicEnabled?: boolean;
  }) {
    return {
      clientName: proposal.clientName,
      clientContactName: proposal.clientContactName,
      title: proposal.title,
      validityDate: proposal.validityDate,
      paymentConditions: proposal.paymentConditions,
      terms: proposal.terms,
      generatedContent: proposal.generatedContent,
      senderSnapshot: proposal.senderSnapshot,
      styleSnapshot: proposal.styleSnapshot,
      status: proposal.status,
      acceptedAt: proposal.acceptedAt ?? null,
      acceptedByName: proposal.acceptedByName ?? null,
      acceptedByEmail: proposal.acceptedByEmail ?? null,
      rejectedAt: proposal.rejectedAt ?? null,
      rejectionReason: proposal.rejectionReason ?? null,
      publicEnabled: proposal.publicEnabled ?? true,
    };
  }

  async acceptPublic(token: string, dto: AcceptProposalDto) {
    this.ensurePublicRateLimit(`accept:${token}`);
    const proposal = await this.getPublicProposalForAction(token);

    if (proposal.status === ProposalStatus.ACCEPTED) {
      return this.toPublicProposal(proposal);
    }

    if (
      proposal.status === ProposalStatus.REJECTED ||
      proposal.status === ProposalStatus.EXPIRED ||
      proposal.status === ProposalStatus.ARCHIVED
    ) {
      throw new BadRequestException("Esta proposta nao pode mais ser aceita.");
    }

    const updated = await this.prisma.proposal.update({
      where: { id: proposal.id },
      data: {
        status: ProposalStatus.ACCEPTED,
        acceptedAt: new Date(),
        acceptedByName: dto.acceptedByName.trim(),
        acceptedByEmail: dto.acceptedByEmail?.trim() || null,
      },
    });

    return this.toPublicProposal(updated);
  }

  async rejectPublic(token: string, dto: RejectProposalDto) {
    this.ensurePublicRateLimit(`reject:${token}`);
    const proposal = await this.getPublicProposalForAction(token);

    if (proposal.status === ProposalStatus.REJECTED) {
      return this.toPublicProposal(proposal);
    }

    if (
      proposal.status === ProposalStatus.ACCEPTED ||
      proposal.status === ProposalStatus.EXPIRED ||
      proposal.status === ProposalStatus.ARCHIVED
    ) {
      throw new BadRequestException("Esta proposta nao pode mais ser recusada.");
    }

    const updated = await this.prisma.proposal.update({
      where: { id: proposal.id },
      data: {
        status: ProposalStatus.REJECTED,
        rejectedAt: new Date(),
        rejectionReason: dto.rejectionReason?.trim() || null,
      },
    });

    return this.toPublicProposal(updated);
  }

  private async getPublicProposalForAction(token: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { publicToken: token },
    });

    if (!proposal || !proposal.publicEnabled) {
      throw new NotFoundException("Proposta nao encontrada.");
    }

    if (!proposal.generatedContent) {
      throw new NotFoundException("Proposta indisponivel.");
    }

    if (this.isExpired(proposal.validityDate)) {
      throw new NotFoundException("Esta proposta expirou.");
    }

    return proposal;
  }

  private ensurePublicRateLimit(key: string) {
    const result = this.publicActionLimiter.consume(key);
    if (!result.allowed) {
      throw new BadRequestException(
        "Muitas tentativas. Aguarde um momento e tente novamente.",
      );
    }
  }

  private generatePublicToken() {
    return randomBytes(18).toString("base64url");
  }

  private buildShareUrl(publicToken: string) {
    const webUrl =
      this.configService.get<string>("WEB_URL")?.trim() ||
      "http://localhost:3000";
    return `${webUrl}/p/${publicToken}`;
  }

  private isExpired(validityDate: Date | null) {
    if (!validityDate) return false;
    return validityDate.getTime() < Date.now();
  }

  async create(authUser: SupabaseUser, dto: CreateProposalDto) {
    const user = await this.usersService.findOrSyncFromSupabase(authUser);
    const company = await this.prisma.company.findUnique({
      where: { userId: user.id },
    });

    if (!company) {
      throw new BadRequestException(
        "Complete o onboarding antes de criar propostas.",
      );
    }

    if (!company.onboardingDone) {
      throw new BadRequestException(
        "Complete o onboarding antes de criar propostas.",
      );
    }

    const snapshots = this.buildSnapshots(company);
    const tone = dto.tone ?? company.defaultTone;

    return this.prisma.proposal.create({
      data: {
        userId: user.id,
        companyId: company.id,
        tone,
        clientName: dto.clientName.trim(),
        clientContactName: this.normalizeOptionalText(dto.clientContactName),
        clientEmail: this.normalizeOptionalText(dto.clientEmail),
        clientPhone: this.normalizeOptionalText(dto.clientPhone),
        clientSegment: this.normalizeOptionalText(dto.clientSegment),
        clientWebsite: this.normalizeOptionalText(dto.clientWebsite),
        clientCity: this.normalizeOptionalText(dto.clientCity),
        clientState: this.normalizeOptionalText(dto.clientState),
        clientDescription: this.normalizeOptionalText(dto.clientDescription),
        clientProblem: this.normalizeOptionalText(dto.clientProblem),
        title: dto.title.trim(),
        serviceOffered: this.normalizeOptionalText(dto.serviceOffered),
        objective: this.normalizeOptionalText(dto.objective),
        scope: (dto.scope ?? []) as unknown as Prisma.InputJsonValue,
        deliverables: (dto.deliverables ?? []) as unknown as Prisma.InputJsonValue,
        timeline: (dto.timeline ?? []) as unknown as Prisma.InputJsonValue,
        investment: (dto.investment ?? []) as unknown as Prisma.InputJsonValue,
        paymentConditions:
          this.normalizeOptionalText(dto.paymentConditions) ??
          company.defaultPaymentConditions,
        validityDate: dto.validityDate
          ? new Date(dto.validityDate)
          : this.getDefaultValidityDate(company.defaultValidityDays),
        observations: this.normalizeOptionalText(dto.observations),
        differentials: (dto.differentials ?? []) as Prisma.InputJsonValue,
        nextSteps: this.normalizeOptionalText(dto.nextSteps),
        terms:
          this.normalizeOptionalText(dto.terms) ?? company.defaultTerms,
        senderSnapshot: snapshots.senderSnapshot as Prisma.InputJsonValue,
        styleSnapshot: snapshots.styleSnapshot as Prisma.InputJsonValue,
        status: ProposalStatus.DRAFT,
      },
    });
  }

  async update(
    authUser: SupabaseUser,
    proposalId: string,
    dto: UpdateProposalDto,
  ) {
    const existing = await this.getById(authUser, proposalId);

    if (existing.status === ProposalStatus.GENERATING) {
      throw new BadRequestException(
        "Aguarde a geracao terminar antes de editar.",
      );
    }

    const data: Prisma.ProposalUpdateInput = {};

    if (dto.clientName !== undefined) data.clientName = dto.clientName.trim();
    if (dto.clientContactName !== undefined) {
      data.clientContactName = this.normalizeOptionalText(dto.clientContactName);
    }
    if (dto.clientEmail !== undefined) {
      data.clientEmail = this.normalizeOptionalText(dto.clientEmail);
    }
    if (dto.clientPhone !== undefined) {
      data.clientPhone = this.normalizeOptionalText(dto.clientPhone);
    }
    if (dto.clientSegment !== undefined) {
      data.clientSegment = this.normalizeOptionalText(dto.clientSegment);
    }
    if (dto.clientWebsite !== undefined) {
      data.clientWebsite = this.normalizeOptionalText(dto.clientWebsite);
    }
    if (dto.clientDescription !== undefined) {
      data.clientDescription = this.normalizeOptionalText(
        dto.clientDescription,
      );
    }
    if (dto.clientProblem !== undefined) {
      data.clientProblem = this.normalizeOptionalText(dto.clientProblem);
    }
    if (dto.title !== undefined) data.title = dto.title.trim();
    if (dto.serviceOffered !== undefined) {
      data.serviceOffered = this.normalizeOptionalText(dto.serviceOffered);
    }
    if (dto.objective !== undefined) {
      data.objective = this.normalizeOptionalText(dto.objective);
    }
    if (dto.scope !== undefined) {
      data.scope = dto.scope as unknown as Prisma.InputJsonValue;
    }
    if (dto.deliverables !== undefined) {
      data.deliverables = dto.deliverables as unknown as Prisma.InputJsonValue;
    }
    if (dto.timeline !== undefined) {
      data.timeline = dto.timeline as unknown as Prisma.InputJsonValue;
    }
    if (dto.investment !== undefined) {
      data.investment = dto.investment as unknown as Prisma.InputJsonValue;
    }
    if (dto.paymentConditions !== undefined) {
      data.paymentConditions = this.normalizeOptionalText(
        dto.paymentConditions,
      );
    }
    if (dto.validityDate !== undefined) {
      data.validityDate = dto.validityDate
        ? new Date(dto.validityDate)
        : null;
    }
    if (dto.observations !== undefined) {
      data.observations = this.normalizeOptionalText(dto.observations);
    }
    if (dto.differentials !== undefined) {
      data.differentials = dto.differentials as Prisma.InputJsonValue;
    }
    if (dto.nextSteps !== undefined) {
      data.nextSteps = this.normalizeOptionalText(dto.nextSteps);
    }
    if (dto.terms !== undefined) {
      data.terms = this.normalizeOptionalText(dto.terms);
    }
    if (dto.tone !== undefined) data.tone = dto.tone;
    if (dto.generatedContent !== undefined) {
      data.generatedContent = dto.generatedContent as Prisma.InputJsonValue;
      if (existing.status === ProposalStatus.DRAFT) {
        data.status = ProposalStatus.READY;
      }
    }
    if (dto.companyResearchSnapshot !== undefined) {
      data.companyResearchSnapshot =
        dto.companyResearchSnapshot as Prisma.InputJsonValue;
    }
    if (dto.companyResearchSources !== undefined) {
      data.companyResearchSources =
        dto.companyResearchSources as Prisma.InputJsonValue;
    }
    if (dto.companyResearchConfirmedAt !== undefined) {
      data.companyResearchConfirmedAt = dto.companyResearchConfirmedAt
        ? new Date(dto.companyResearchConfirmedAt)
        : null;
    }

    return this.prisma.proposal.update({
      where: { id: proposalId },
      data,
    });
  }

  async generate(
    authUser: SupabaseUser,
    proposalId: string,
    dto: GenerateProposalDto,
  ) {
    const user = await this.usersService.findOrSyncFromSupabase(authUser);
    const proposal = await this.getById(authUser, proposalId);

    if (proposal.status === ProposalStatus.GENERATING) {
      throw new BadRequestException("Geracao ja em andamento.");
    }

    const isFirstGeneration = !proposal.quotaConsumedAt && !dto.section;

    if (isFirstGeneration) {
      await this.entitlementsService.assertCanGenerate(
        user.id,
        proposal.quotaConsumedAt,
      );
    }

    await this.prisma.proposal.update({
      where: { id: proposalId },
      data: { status: ProposalStatus.GENERATING },
    });

    const tone = dto.tone ?? proposal.tone;
    const existingContent = proposal.generatedContent as
      | GeneratedProposalContent
      | null;

    const referenceIds = dto.referenceProposalIds ?? [];
    let referenceSummary: string | null = null;

    if (referenceIds.length > 0) {
      const reference = await this.prisma.proposal.findFirst({
        where: {
          id: referenceIds[0],
          userId: user.id,
          generatedContent: { not: null as never },
        },
      });

      referenceSummary =
        this.proposalReferenceService.buildReferenceSummary(reference);
    }

    const companyResearch = proposal.companyResearchSnapshot as
      | CompanyAnalysis
      | null;

    try {
      const generated = await this.geminiService.generateProposalContent({
        tone,
        sender: proposal.senderSnapshot as Record<string, unknown>,
        style: proposal.styleSnapshot as Record<string, unknown>,
        clientName: proposal.clientName,
        clientContactName: proposal.clientContactName,
        clientEmail: proposal.clientEmail,
        clientPhone: proposal.clientPhone,
        clientSegment: proposal.clientSegment,
        clientWebsite: proposal.clientWebsite,
        clientCity: proposal.clientCity,
        clientState: proposal.clientState,
        clientDescription: proposal.clientDescription,
        clientProblem: proposal.clientProblem,
        title: proposal.title,
        serviceOffered: proposal.serviceOffered,
        objective: proposal.objective,
        scope: proposal.scope,
        deliverables: proposal.deliverables,
        timeline: proposal.timeline,
        investment: proposal.investment,
        paymentConditions: proposal.paymentConditions,
        validityDate: proposal.validityDate?.toISOString() ?? null,
        observations: proposal.observations,
        differentials: proposal.differentials,
        nextSteps: proposal.nextSteps,
        terms: proposal.terms,
        section: dto.section,
        existingContent,
        companyResearch,
        referenceSummary,
      });

      if (isFirstGeneration) {
        await this.entitlementsService.consumeQuotaIfNeeded(
          user.id,
          proposalId,
        );
      }

      return this.prisma.proposal.update({
        where: { id: proposalId },
        data: {
          tone,
          generatedContent: generated as Prisma.InputJsonValue,
          status: ProposalStatus.READY,
          generatedAt: new Date(),
          generationModel: this.geminiService.getModelName(),
          generationPromptVersion: this.geminiService.getPromptVersion(),
          referenceProposalIds:
            referenceIds.length > 0
              ? (referenceIds as Prisma.InputJsonValue)
              : undefined,
        },
      });
    } catch (error) {
      await this.prisma.proposal.update({
        where: { id: proposalId },
        data: {
          status: existingContent
            ? ProposalStatus.READY
            : ProposalStatus.DRAFT,
        },
      });

      throw error;
    }
  }

  private buildSnapshots(company: {
    profileType: string;
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
    responsibleName: string | null;
    responsibleRole: string | null;
    presentationText: string | null;
    contactText: string | null;
    document: string | null;
    address: string | null;
    footerText: string | null;
    showContactData: boolean;
    showSignature: boolean;
    defaultIntroMessage: string | null;
    defaultClosingMessage: string | null;
    defaultTerms: string | null;
    showDetailedValues: boolean;
    showDiscount: boolean;
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
  }) {
    return {
      senderSnapshot: {
        profileType: company.profileType,
        name: company.name,
        displayName: company.tradeName ?? company.name,
        description: company.description,
        segment: company.segment,
        website: company.website,
        commercialEmail: company.commercialEmail,
        whatsapp: company.whatsapp,
        instagram: company.instagram,
        city: company.city,
        state: company.state,
        logoUrl: company.logoUrl,
        responsibleName: company.responsibleName,
        responsibleRole: company.responsibleRole,
        presentationText: company.presentationText,
        contactText: company.contactText,
        document: company.document,
        address: company.address,
        footerText: company.footerText,
        showContactData: company.showContactData,
        showSignature: company.showSignature,
        defaultIntroMessage: company.defaultIntroMessage,
        defaultClosingMessage: company.defaultClosingMessage,
        defaultTerms: company.defaultTerms,
        showDetailedValues: company.showDetailedValues,
        showDiscount: company.showDiscount,
      },
      styleSnapshot: {
        primaryColor: company.primaryColor,
        secondaryColor: company.secondaryColor,
        accentColor: company.accentColor,
        backgroundColor: company.backgroundColor,
        surfaceColor: company.surfaceColor,
        textColor: company.textColor,
        visualPreference: company.visualPreference,
        fontPreference: company.fontPreference,
        visualStyle: company.visualStyle,
        borderRadius: company.borderRadius,
        logoUrl: company.logoUrl,
      },
    };
  }

  private getDefaultValidityDate(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  }

  private normalizeOptionalText(value?: string) {
    if (!value?.trim()) {
      return null;
    }

    return value.trim();
  }
}
