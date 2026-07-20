import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { Prisma } from "../../generated/prisma/client";
import { ProposalStatus } from "../../generated/prisma/enums";
import { PrismaService } from "../../database/prisma.service";
import { UsersService } from "../users/users.service";
import type { CreateProposalDto } from "./dto/create-proposal.dto";
import type { GenerateProposalDto } from "./dto/generate-proposal.dto";
import type { UpdateProposalDto } from "./dto/update-proposal.dto";
import {
  GeminiService,
  type GeneratedProposalContent,
} from "./gemini.service";

@Injectable()
export class ProposalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly geminiService: GeminiService,
  ) {}

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
    const proposal = await this.getById(authUser, proposalId);

    if (proposal.status === ProposalStatus.GENERATING) {
      throw new BadRequestException("Geracao ja em andamento.");
    }

    await this.prisma.proposal.update({
      where: { id: proposalId },
      data: { status: ProposalStatus.GENERATING },
    });

    const tone = dto.tone ?? proposal.tone;
    const existingContent = proposal.generatedContent as
      | GeneratedProposalContent
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
      });

      return this.prisma.proposal.update({
        where: { id: proposalId },
        data: {
          tone,
          generatedContent: generated as Prisma.InputJsonValue,
          status: ProposalStatus.READY,
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
