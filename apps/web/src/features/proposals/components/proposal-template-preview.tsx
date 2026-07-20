"use client";

import type { CompanyBrandInput } from "@/features/company/schemas/company.schema";
import {
  getFontFamily,
  getRadiusValue,
  getReadableTextColor,
  getTemplateLayout,
} from "@/features/company/utils/brand";
import {
  getFontPreferenceLabel,
  getVisualStyleLabel,
  formatCurrency,
} from "@/features/company/utils/labels";
import {
  DEMO_CLIENT_NAME,
  DEMO_PROPOSAL_CONTENT,
  DEMO_VALIDITY_LABEL,
} from "@/config/proposal-model";
import type { GeneratedProposalContent } from "@/features/proposals/types/proposal";

type ProposalTemplatePreviewProps = {
  companyName: string;
  brand: CompanyBrandInput;
  presentationText?: string | null;
  content?: GeneratedProposalContent;
  clientName?: string;
  validityLabel?: string;
  paymentConditions?: string | null;
  terms?: string | null;
  footerText?: string | null;
  document?: string | null;
  address?: string | null;
  contactText?: string | null;
  responsibleName?: string | null;
  showDetailedValues?: boolean;
  compact?: boolean;
  printMode?: boolean;
};

export function ProposalTemplatePreview({
  companyName,
  brand,
  presentationText,
  content = DEMO_PROPOSAL_CONTENT,
  clientName = DEMO_CLIENT_NAME,
  validityLabel = DEMO_VALIDITY_LABEL,
  paymentConditions = "50% na aprovacao e 50% na entrega.",
  terms = "Escopo valido conforme descrito. Alteracoes extras serao orcadas separadamente.",
  footerText,
  document,
  address,
  contactText,
  responsibleName,
  showDetailedValues = true,
  compact = false,
  printMode = false,
}: ProposalTemplatePreviewProps) {
  const layout = getTemplateLayout(brand.visualStyle);
  const radius = getRadiusValue(brand.borderRadius);
  const fontFamily = getFontFamily(brand.fontPreference);
  const buttonTextColor = getReadableTextColor(brand.primaryColor);

  const headerStyle = layout.gradientHeader
    ? {
        background: `linear-gradient(135deg, ${brand.primaryColor}22, ${brand.secondaryColor}18)`,
        borderColor: brand.secondaryColor,
      }
    : { borderColor: brand.secondaryColor };

  const totalInvestment = content.investment.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  return (
    <div className={compact ? "space-y-2" : printMode ? "" : "lg:sticky lg:top-6"}>
      {!printMode ? (
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Modelo comercial completo</p>
            <p className="text-xs text-muted-foreground">
              {getVisualStyleLabel(brand.visualStyle)} ·{" "}
              {getFontPreferenceLabel(brand.fontPreference)}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary">
            Preview
          </span>
        </div>
      ) : null}

      <div
        className={`overflow-hidden border shadow-sm ${compact ? "max-h-[520px] overflow-y-auto" : ""} ${printMode ? "shadow-none" : ""}`}
        style={{
          backgroundColor: brand.backgroundColor,
          color: brand.textColor,
          borderRadius: radius,
          fontFamily,
        }}
      >
        <div className={layout.headerClass} style={headerStyle}>
          {layout.accentBar ? (
            <div
              className="mb-3 h-1 w-14 rounded-full"
              style={{ backgroundColor: brand.accentColor }}
            />
          ) : null}

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {brand.logoUrl ? (
                <img
                  src={brand.logoUrl}
                  alt={companyName}
                  className="size-11 object-contain"
                  style={{ borderRadius: radius }}
                />
              ) : (
                <div
                  className="flex size-11 items-center justify-center text-sm font-semibold"
                  style={{
                    backgroundColor: brand.primaryColor,
                    color: buttonTextColor,
                    borderRadius: radius,
                  }}
                >
                  {companyName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-base font-semibold">{companyName}</p>
                <p className="text-xs opacity-75">
                  {presentationText ?? "Proposta comercial"}
                </p>
              </div>
            </div>
            <div className="text-right text-[11px] opacity-70">
              <p>{validityLabel}</p>
              <p>{new Date().toLocaleDateString("pt-BR")}</p>
            </div>
          </div>
        </div>

        <div className={`${layout.cardClass} ${compact ? "space-y-4" : ""}`}>
          <PreviewSection
            title="Cliente"
            accent={brand.accentColor}
            titleClass={layout.sectionTitleClass}
          >
            <p className="font-medium">{clientName}</p>
          </PreviewSection>

          <PreviewSection
            title={content.title}
            accent={brand.accentColor}
            titleClass={layout.sectionTitleClass}
          >
            <p className="text-sm leading-6">{content.introduction}</p>
          </PreviewSection>

          {!compact ? (
            <>
              <PreviewSection
                title="Contexto do cliente"
                accent={brand.accentColor}
                titleClass={layout.sectionTitleClass}
              >
                <p className="text-sm leading-6">{content.clientContext}</p>
              </PreviewSection>

              <PreviewSection
                title="Desafio identificado"
                accent={brand.accentColor}
                titleClass={layout.sectionTitleClass}
              >
                <p className="text-sm leading-6">{content.problem}</p>
              </PreviewSection>
            </>
          ) : null}

          <PreviewSection
            title="Solucao proposta"
            accent={brand.accentColor}
            titleClass={layout.sectionTitleClass}
          >
            <p className="text-sm leading-6">{content.proposedSolution}</p>
          </PreviewSection>

          <PreviewSection
            title="Escopo do projeto"
            accent={brand.accentColor}
            titleClass={layout.sectionTitleClass}
          >
            <ul className="space-y-2 text-sm">
              {content.scope.slice(0, compact ? 2 : undefined).map((item) => (
                <li key={item.id}>
                  <p className="font-medium">{item.title}</p>
                  {!compact ? (
                    <p className="opacity-75">{item.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </PreviewSection>

          {!compact ? (
            <>
              <PreviewSection
                title="Entregaveis"
                accent={brand.accentColor}
                titleClass={layout.sectionTitleClass}
              >
                <ul className="space-y-2 text-sm">
                  {content.deliverables.map((item) => (
                    <li key={item.id}>
                      <p className="font-medium">{item.title}</p>
                      <p className="opacity-75">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </PreviewSection>

              <PreviewSection
                title="Cronograma"
                accent={brand.accentColor}
                titleClass={layout.sectionTitleClass}
              >
                <ul className="space-y-2 text-sm">
                  {content.timeline.map((item) => (
                    <li key={item.id}>
                      <p className="font-medium">
                        {item.title}
                        {item.duration ? ` · ${item.duration}` : ""}
                      </p>
                      <p className="opacity-75">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </PreviewSection>
            </>
          ) : null}

          <div
            className="border p-4"
            style={{
              backgroundColor: brand.surfaceColor,
              borderColor: brand.secondaryColor,
              borderRadius: radius,
            }}
          >
            <PreviewSection
              title="Investimento"
              accent={brand.accentColor}
              titleClass={layout.sectionTitleClass}
            >
              {showDetailedValues && content.investment.length > 1 ? (
                <ul className="mb-3 space-y-2 text-sm">
                  {content.investment.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-3"
                    >
                      <div>
                        <p className="font-medium">{item.label}</p>
                        {item.description ? (
                          <p className="opacity-75">{item.description}</p>
                        ) : null}
                      </div>
                      <p className="shrink-0 font-semibold">
                        {formatCurrency(item.amount)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="text-2xl font-semibold">
                {formatCurrency(totalInvestment)}
              </p>
              {content.investment[0]?.description && !showDetailedValues ? (
                <p className="mt-1 text-sm opacity-75">
                  {content.investment[0].description}
                </p>
              ) : showDetailedValues && content.investment.length === 1 ? (
                content.investment[0]?.description ? (
                  <p className="mt-1 text-sm opacity-75">
                    {content.investment[0].description}
                  </p>
                ) : null
              ) : null}
            </PreviewSection>

            {paymentConditions ? (
              <PreviewSection
                title="Condicoes de pagamento"
                accent={brand.accentColor}
                titleClass={layout.sectionTitleClass}
              >
                <p className="text-sm leading-6">{paymentConditions}</p>
              </PreviewSection>
            ) : null}
          </div>

          {!compact && content.differentials.length > 0 ? (
            <PreviewSection
              title="Diferenciais"
              accent={brand.accentColor}
              titleClass={layout.sectionTitleClass}
            >
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {content.differentials.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </PreviewSection>
          ) : null}

          <PreviewSection
            title="Proximos passos"
            accent={brand.accentColor}
            titleClass={layout.sectionTitleClass}
          >
            <p className="text-sm leading-6">{content.nextSteps}</p>
          </PreviewSection>

          {!compact ? (
            <>
              <PreviewSection
                title="Encerramento"
                accent={brand.accentColor}
                titleClass={layout.sectionTitleClass}
              >
                <p className="text-sm leading-6">{content.closing}</p>
              </PreviewSection>

              {terms ? (
                <PreviewSection
                  title="Termos e observacoes"
                  accent={brand.accentColor}
                  titleClass={layout.sectionTitleClass}
                >
                  <p className="text-sm leading-6">{terms}</p>
                </PreviewSection>
              ) : null}

              {contactText || responsibleName || document || address ? (
                <PreviewSection
                  title="Contato"
                  accent={brand.accentColor}
                  titleClass={layout.sectionTitleClass}
                >
                  {responsibleName ? (
                    <p className="font-medium">{responsibleName}</p>
                  ) : null}
                  {contactText ? (
                    <p className="whitespace-pre-line text-sm opacity-80">
                      {contactText}
                    </p>
                  ) : null}
                  {document ? (
                    <p className="mt-2 text-xs opacity-70">{document}</p>
                  ) : null}
                  {address ? (
                    <p className="text-xs opacity-70">{address}</p>
                  ) : null}
                </PreviewSection>
              ) : null}

              {footerText ? (
                <p className="border-t pt-4 text-center text-[11px] leading-5 opacity-60">
                  {footerText}
                </p>
              ) : null}
            </>
          ) : null}

          {!printMode ? (
            <button
              type="button"
              className="w-full px-4 py-2.5 text-sm font-medium"
              style={{
                backgroundColor: brand.primaryColor,
                color: buttonTextColor,
                borderRadius: radius,
              }}
            >
              Aprovar proposta
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PreviewSection({
  title,
  accent,
  titleClass,
  children,
}: {
  title: string;
  accent: string;
  titleClass: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className={titleClass} style={{ color: accent }}>
        {title}
      </h3>
      <div className="mt-2">{children}</div>
    </section>
  );
}
