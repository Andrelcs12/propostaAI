import { apiFetch } from "@/lib/api/client";
import type {
  BillingConfig,
  BillingStatus,
  BillingUsage,
} from "../types/billing";

export function getBillingConfig(accessToken?: string) {
  return apiFetch<BillingConfig>(
    "/api/billing/config",
    accessToken ? { accessToken } : {},
  );
}

export function getBillingUsage(accessToken: string) {
  return apiFetch<BillingUsage>("/api/billing/usage", { accessToken });
}

export function getBillingStatus(accessToken: string) {
  return apiFetch<BillingStatus>("/api/billing/status", { accessToken });
}

export function createCheckoutSession(accessToken: string) {
  return apiFetch<{ url: string }>("/api/billing/checkout", {
    method: "POST",
    accessToken,
  });
}

export function createPortalSession(accessToken: string) {
  return apiFetch<{ url: string }>("/api/billing/portal", {
    method: "POST",
    accessToken,
  });
}
