"use client";

import type { CompanyBrandInput } from "../schemas/company.schema";
import type { Company } from "../types/company";
import { getRadiusValue, getReadableTextColor } from "../utils/brand";

type BrandPreviewProps = {
  company: Company | null;
  brand: CompanyBrandInput;
};

export function BrandPreview({ company, brand }: BrandPreviewProps) {
  const companyName = company?.tradeName || company?.name || "Sua empresa";
  const buttonTextColor = getReadableTextColor(brand.primaryColor);

  return (
    <div
      className="overflow-hidden border"
      style={{
        backgroundColor: brand.backgroundColor,
        color: brand.textColor,
        borderRadius: getRadiusValue(brand.borderRadius),
      }}
    >
      <div className="p-5">
        <div className="mb-6 flex items-center gap-3">
          {brand.logoUrl ? (
            <img
              src={brand.logoUrl}
              alt={companyName}
              className="size-10 rounded-md object-cover"
            />
          ) : (
            <div
              className="flex size-10 items-center justify-center font-semibold"
              style={{
                backgroundColor: brand.primaryColor,
                color: buttonTextColor,
                borderRadius: getRadiusValue(brand.borderRadius),
              }}
            >
              {companyName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold">{companyName}</p>
            <p className="text-xs opacity-70">Brand Kit da proposta</p>
          </div>
        </div>

        <div
          className="border p-4"
          style={{
            backgroundColor: brand.surfaceColor,
            borderColor: brand.secondaryColor,
            borderRadius: getRadiusValue(brand.borderRadius),
          }}
        >
          <p
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: brand.accentColor }}
          >
            Proposta comercial
          </p>
          <h3 className="mt-2 text-xl font-semibold">
            Projeto profissional para seu cliente
          </h3>
          <p className="mt-3 text-sm opacity-75">
            Escopo claro, objetivos definidos e proximos passos organizados em
            uma apresentacao consistente.
          </p>
          <button
            type="button"
            className="mt-5 px-4 py-2 text-sm font-medium"
            style={{
              backgroundColor: brand.primaryColor,
              color: buttonTextColor,
              borderRadius: getRadiusValue(brand.borderRadius),
            }}
          >
            Aprovar proposta
          </button>
        </div>
      </div>
    </div>
  );
}
