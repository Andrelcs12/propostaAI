import { BadRequestException, Injectable } from "@nestjs/common";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { UpdateCompanyBasicDto } from "./dto/update-company-basic.dto";
import type { UpdateCompanyBrandDto } from "./dto/update-company-brand.dto";
import type { UpdateCompanyCommercialDto } from "./dto/update-company-commercial.dto";
import { PrismaService } from "../../database/prisma.service";
import { UsersService } from "../users/users.service";

type CompanyRecord = Awaited<
  ReturnType<PrismaService["company"]["findUnique"]>
>;

@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async getMyCompany(authUser: SupabaseUser) {
    const user = await this.usersService.findOrSyncFromSupabase(authUser);
    const company = await this.prisma.company.findUnique({
      where: { userId: user.id },
    });

    return this.toStatusResponse(company);
  }

  async updateBasic(authUser: SupabaseUser, dto: UpdateCompanyBasicDto) {
    const user = await this.usersService.findOrSyncFromSupabase(authUser);
    const data = this.getBasicData(dto);

    const company = await this.prisma.company.upsert({
      where: { userId: user.id },
      update: {
        ...data,
        onboardingStep: { set: 2 },
      },
      create: {
        ...data,
        userId: user.id,
        onboardingStep: 2,
      },
    });

    return this.toStatusResponse(company);
  }

  async updateBrand(authUser: SupabaseUser, dto: UpdateCompanyBrandDto) {
    const user = await this.usersService.findOrSyncFromSupabase(authUser);
    await this.ensureCompanyExists(user.id);

    const company = await this.prisma.company.update({
      where: { userId: user.id },
      data: {
        ...this.getBrandData(dto),
        onboardingStep: { set: 3 },
      },
    });

    return this.toStatusResponse(company);
  }

  async updateCommercial(
    authUser: SupabaseUser,
    dto: UpdateCompanyCommercialDto,
  ) {
    const user = await this.usersService.findOrSyncFromSupabase(authUser);
    await this.ensureCompanyExists(user.id);

    const company = await this.prisma.company.update({
      where: { userId: user.id },
      data: this.getCommercialData(dto),
    });

    return this.toStatusResponse(company);
  }

  async completeOnboarding(authUser: SupabaseUser) {
    const user = await this.usersService.findOrSyncFromSupabase(authUser);
    const existing = await this.ensureCompanyExists(user.id);

    if (!existing.name.trim()) {
      throw new BadRequestException(
        "Informe o nome da empresa antes de concluir.",
      );
    }

    const company = await this.prisma.company.update({
      where: { userId: user.id },
      data: {
        onboardingDone: true,
        onboardingStep: 3,
      },
    });

    return this.toStatusResponse(company);
  }

  private async ensureCompanyExists(userId: string) {
    const company = await this.prisma.company.findUnique({
      where: { userId },
    });

    if (!company) {
      throw new BadRequestException(
        "Complete os dados basicos da empresa primeiro.",
      );
    }

    return company;
  }

  private getBasicData(dto: UpdateCompanyBasicDto) {
    return {
      name: dto.name.trim(),
      tradeName: this.normalizeOptionalText(dto.tradeName),
      description: this.normalizeOptionalText(dto.description),
      segment: this.normalizeOptionalText(dto.segment),
      website: this.normalizeOptionalText(dto.website),
      commercialEmail: this.normalizeOptionalText(dto.commercialEmail),
      whatsapp: this.normalizeOptionalText(dto.whatsapp),
      instagram: this.normalizeOptionalText(dto.instagram),
      city: this.normalizeOptionalText(dto.city),
      state: this.normalizeOptionalText(dto.state)?.toUpperCase() ?? null,
    };
  }

  private getBrandData(dto: UpdateCompanyBrandDto) {
    return {
      logoUrl: this.normalizeOptionalText(dto.logoUrl),
      lightLogoUrl: this.normalizeOptionalText(dto.lightLogoUrl),
      primaryColor: dto.primaryColor,
      secondaryColor: dto.secondaryColor,
      accentColor: dto.accentColor,
      backgroundColor: dto.backgroundColor,
      surfaceColor: dto.surfaceColor,
      textColor: dto.textColor,
      visualPreference: dto.visualPreference,
      fontPreference: dto.fontPreference,
      visualStyle: dto.visualStyle,
      borderRadius: dto.borderRadius,
    };
  }

  private getCommercialData(dto: UpdateCompanyCommercialDto) {
    return {
      responsibleName: this.normalizeOptionalText(dto.responsibleName),
      responsibleRole: this.normalizeOptionalText(dto.responsibleRole),
      document: this.normalizeOptionalText(dto.document),
      address: this.normalizeOptionalText(dto.address),
      presentationText: this.normalizeOptionalText(dto.presentationText),
      footerText: this.normalizeOptionalText(dto.footerText),
      contactText: this.normalizeOptionalText(dto.contactText),
    };
  }

  private normalizeOptionalText(value?: string) {
    if (!value?.trim()) {
      return null;
    }

    return value.trim();
  }

  private toStatusResponse(company: CompanyRecord) {
    if (!company) {
      return {
        company: null,
        onboardingDone: false,
        onboardingStep: 1,
      };
    }

    return {
      company,
      onboardingDone: company.onboardingDone,
      onboardingStep: company.onboardingStep,
    };
  }
}
