import { apiFetch } from "@/lib/api/client";
import type {
  CompanyBasicInput,
  CompanyBrandInput,
  CompanyCommercialInput,
  CompanyDefaultsInput,
  CompanyIdentityInput,
  ProfileTypeInput,
} from "../schemas/company.schema";
import type { CompanyStatus } from "../types/company";

export async function getCompanyStatus(
  accessToken: string,
): Promise<CompanyStatus> {
  return apiFetch<CompanyStatus>("/api/company/me", {
    accessToken,
    cache: "no-store",
  });
}

export async function updateProfileType(
  accessToken: string,
  input: ProfileTypeInput,
): Promise<CompanyStatus> {
  return apiFetch<CompanyStatus>("/api/company/me/profile-type", {
    method: "PATCH",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function updateCompanyBasic(
  accessToken: string,
  input: CompanyBasicInput,
): Promise<CompanyStatus> {
  return apiFetch<CompanyStatus>("/api/company/me/basic", {
    method: "PATCH",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function updateCompanyBrand(
  accessToken: string,
  input: CompanyBrandInput,
): Promise<CompanyStatus> {
  return apiFetch<CompanyStatus>("/api/company/me/brand", {
    method: "PATCH",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function updateCompanyIdentity(
  accessToken: string,
  input: CompanyIdentityInput,
): Promise<CompanyStatus> {
  return apiFetch<CompanyStatus>("/api/company/me/identity", {
    method: "PATCH",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function updateCompanyDefaults(
  accessToken: string,
  input: CompanyDefaultsInput,
): Promise<CompanyStatus> {
  return apiFetch<CompanyStatus>("/api/company/me/defaults", {
    method: "PATCH",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function updateCompanyCommercial(
  accessToken: string,
  input: CompanyCommercialInput,
): Promise<CompanyStatus> {
  return apiFetch<CompanyStatus>("/api/company/me/commercial", {
    method: "PATCH",
    accessToken,
    body: JSON.stringify(input),
  });
}

export async function completeCompanyOnboarding(
  accessToken: string,
): Promise<CompanyStatus> {
  return apiFetch<CompanyStatus>("/api/company/me/complete-onboarding", {
    method: "POST",
    accessToken,
    body: JSON.stringify({}),
  });
}
