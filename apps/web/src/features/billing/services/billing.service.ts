import { apiFetch } from "@/lib/api/client";
import type { BillingConfig } from "../types/billing";

export function getBillingConfig(accessToken?: string) {
  return apiFetch<BillingConfig>(
    "/api/billing/config",
    accessToken ? { accessToken } : {}
  );
}
