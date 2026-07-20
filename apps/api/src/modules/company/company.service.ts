import { BadRequestException, Injectable } from "@nestjs/common";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { UpdateCompanyBasicDto } from "./dto/update-company-basic.dto";
import type { UpdateCompanyBrandDto } from "./dto/update-company-brand.dto";
import type { UpdateCompanyCommercialDto } from "./dto/update-company-commercial.dto";
import type { UpdateCompanyDefaultsDto } from "./dto/update-company-defaults.dto";
import type { UpdateCompanyIdentityDto } from "./dto/update-company-identity.dto";
import type { UpdateProfileTypeDto } from "./dto/update-profile-type.dto";
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

  async updateProfileType(
    authUser: SupabaseUser,
    dto: UpdateProfileTypeDto,
  ) {
    const user = await this.usersService.findOrSyncFromSupabase(authUser);

    const company = await this.prisma.company.upsert({
      where: { userId: user.id },
      update: {
        profileType: dto.profileType,
        onboardingStep: { set: 2 },
      },
      create: {
        userId: user.id,
        name: user.name,
        profileType: dto.profileType,
        onboardingStep: 2,
      },
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
        onboardingStep: { set: 3 },
      },
      create: {
        ...data,
        userId: user.id,
        onboardingStep: 3,
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
        onboardingStep: { set: 4 },
      },
    });

    return this.toStatusResponse(company);
  }

  async updateIdentity(
    authUser: SupabaseUser,
    dto: UpdateCompanyIdentityDto,
  ) {
    const user = await this.usersService.findOrSyncFromSupabase(authUser);
    await this.ensureCompanyExists(user.id);

    const company = await this.prisma.company.update({
      where: { userId: user.id },
      data: {
        tradeName: this.normalizeOptionalText(dto.tradeName),
        presentationText: this.normalizeOptionalText(dto.presentationText),
        responsibleName: this.normalizeOptionalText(dto.responsibleName),
        responsibleRole: this.normalizeOptionalText(dto.responsibleRole),
        contactText: this.normalizeOptionalText(dto.contactText),
        showContactData: dto.showContactData,
        showSignature: dto.showSignature,
        onboardingStep: { set: 4 },
      },
    });

    return this.toStatusResponse(company);
  }

  async updateDefaults(authUser: SupabaseUser, dto: UpdateCompanyDefaultsDto) {
    const user = await this.usersService.findOrSyncFromSupabase(authUser);
    await this.ensureCompanyExists(user.id);

    const company = await this.prisma.company.update({
      where: { userId: user.id },
      data: {
        defaultValidityDays: dto.defaultValidityDays,
        defaultDeliveryTime: this.normalizeOptionalText(
          dto.defaultDeliveryTime,
        ),
        defaultPaymentConditions: this.normalizeOptionalText(
          dto.defaultPaymentConditions,
        ),
        defaultCurrency: dto.defaultCurrency?.toUpperCase(),
        defaultBillingType: dto.defaultBillingType,
        defaultIntroMessage: this.normalizeOptionalText(
          dto.defaultIntroMessage,
        ),
        defaultClosingMessage: this.normalizeOptionalText(
          dto.defaultClosingMessage,
        ),
        defaultTerms: this.normalizeOptionalText(dto.defaultTerms),
        showDetailedValues: dto.showDetailedValues,
        showDiscount: dto.showDiscount,
        defaultTone: dto.defaultTone,
        onboardingStep: { set: 5 },
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
        "Informe o nome antes de concluir o onboarding.",
      );
    }

    const company = await this.prisma.company.update({
      where: { userId: user.id },
      data: {
        onboardingDone: true,
        onboardingStep: 5,
        onboardingCompletedAt: new Date(),
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
        "Complete os dados basicos primeiro.",
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
      defaultClosingMessage:
        this.normalizeOptionalText(dto.footerText) ?? undefined,
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
