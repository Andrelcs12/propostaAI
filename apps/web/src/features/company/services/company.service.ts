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

export async function uploadCompanyLogo(
  accessToken: string,
  file: File,
  variant: "default" | "light" = "default",
) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL nao configurada");
  }

  const formData = new FormData();
  formData.append("file", file);

  const query = variant === "light" ? "?variant=light" : "";
  const response = await fetch(`${baseUrl}/api/company/me/logo${query}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const contentType = response.headers.get("content-type");
  const body: unknown = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof (body as Record<string, unknown>).message === "string"
        ? String((body as Record<string, unknown>).message)
        : "Nao foi possivel enviar a logo.";

    throw new Error(message);
  }

  return body as { url: string; variant: "default" | "light" };
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
