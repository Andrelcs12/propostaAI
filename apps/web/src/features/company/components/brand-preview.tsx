"use client";

import type { CompanyBrandInput } from "../schemas/company.schema";
import type { Company } from "../types/company";
import { ProposalTemplatePreview } from "@/features/proposals/components/proposal-template-preview";

type BrandPreviewProps = {
  company: Company | null;
  brand: CompanyBrandInput;
  compact?: boolean;
};

export function BrandPreview({ company, brand, compact }: BrandPreviewProps) {
  const companyName = company?.tradeName || company?.name || "Sua empresa";

  const validityLabel = company?.defaultValidityDays
    ? `Valida por ${company.defaultValidityDays} dias`
    : null;

  return (
    <ProposalTemplatePreview
      companyName={companyName}
      brand={brand}
      presentationText={company?.presentationText ?? null}
      paymentConditions={
        company?.defaultPaymentConditions ??
        "50% na aprovacao e 50% na entrega."
      }
      terms={company?.defaultTerms ?? null}
      footerText={company?.footerText ?? null}
      document={company?.document ?? null}
      address={company?.address ?? null}
      contactText={company?.contactText ?? null}
      responsibleName={company?.responsibleName ?? null}
      showDetailedValues={company?.showDetailedValues ?? true}
      {...(validityLabel ? { validityLabel } : {})}
      {...(compact !== undefined ? { compact } : {})}
    />
  );
}
