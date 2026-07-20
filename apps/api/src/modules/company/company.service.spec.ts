import { BadRequestException } from "@nestjs/common";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { PrismaService } from "../../database/prisma.service";
import { UsersService } from "../users/users.service";
import { CompanyService } from "./company.service";
import type { UpdateCompanyBrandDto } from "./dto/update-company-brand.dto";

const authUser = {
  id: "supabase-user-id",
  email: "andre@novely.com",
  user_metadata: { name: "Andre Lucas" },
} as unknown as SupabaseUser;

function createService() {
  const prisma = {
    company: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
      update: vi.fn(),
    },
  };
  const usersService = {
    findOrSyncFromSupabase: vi.fn().mockResolvedValue({
      id: "user-id",
      supabaseUserId: "supabase-user-id",
      name: "Andre Lucas",
      email: "andre@novely.com",
      avatarUrl: null,
      createdAt: "2026-01-01T00:00:00.000Z",
    }),
  };

  return {
    prisma,
    usersService,
    service: new CompanyService(
      prisma as unknown as PrismaService,
      usersService as unknown as UsersService,
    ),
  };
}

describe("CompanyService", () => {
  it("returns onboarding status when company does not exist", async () => {
    const { service, prisma } = createService();
    prisma.company.findUnique.mockResolvedValue(null);

    await expect(service.getMyCompany(authUser)).resolves.toEqual({
      company: null,
      onboardingDone: false,
      onboardingStep: 1,
    });
  });

  it("creates or updates the authenticated user's company basic data", async () => {
    const { service, prisma } = createService();
    prisma.company.upsert.mockResolvedValue({
      id: "company-id",
      userId: "user-id",
      name: "Proposta AI",
      onboardingDone: false,
      onboardingStep: 3,
    });

    await service.updateBasic(authUser, { name: "Proposta AI" });

    expect(prisma.company.upsert).toHaveBeenCalledWith({
      where: { userId: "user-id" },
      update: {
        name: "Proposta AI",
        tradeName: null,
        description: null,
        segment: null,
        website: null,
        commercialEmail: null,
        whatsapp: null,
        instagram: null,
        city: null,
        state: null,
        onboardingStep: { set: 3 },
      },
      create: {
        name: "Proposta AI",
        tradeName: null,
        description: null,
        segment: null,
        website: null,
        commercialEmail: null,
        whatsapp: null,
        instagram: null,
        city: null,
        state: null,
        userId: "user-id",
        onboardingStep: 3,
      },
    });
  });

  it("does not update brand data before basic company exists", async () => {
    const { service, prisma } = createService();
    prisma.company.findUnique.mockResolvedValue(null);

    await expect(
      service.updateBrand(authUser, {
        primaryColor: "#0F766E",
        secondaryColor: "#14B8A6",
        accentColor: "#06B6D4",
        backgroundColor: "#F8FAFC",
        surfaceColor: "#FFFFFF",
        textColor: "#0F172A",
        visualPreference: "LIGHT",
        fontPreference: "INTER",
        visualStyle: "MINIMAL",
        borderRadius: "MEDIUM",
      } as unknown as UpdateCompanyBrandDto),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("completes onboarding idempotently for the authenticated user", async () => {
    const { service, prisma } = createService();
    prisma.company.findUnique.mockResolvedValue({
      id: "company-id",
      userId: "user-id",
      name: "Proposta AI",
    });
    prisma.company.update.mockResolvedValue({
      id: "company-id",
      userId: "user-id",
      name: "Proposta AI",
      onboardingDone: true,
      onboardingStep: 5,
    });

    await service.completeOnboarding(authUser);

    expect(prisma.company.update).toHaveBeenCalledWith({
      where: { userId: "user-id" },
      data: expect.objectContaining({
        onboardingDone: true,
        onboardingStep: 5,
        onboardingCompletedAt: expect.any(Date),
      }),
    });
  });
});
