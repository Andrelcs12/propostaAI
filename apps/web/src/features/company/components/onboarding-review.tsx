"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BrandPreview } from "./brand-preview";
import { completeCompanyOnboarding } from "../services/company.service";
import { getCurrentAccessToken } from "../services/session-token.service";
import {
  PROPOSAL_TONE_OPTIONS,
  PROFILE_TYPE_OPTIONS,
  type Company,
} from "../types/company";

type OnboardingReviewProps = {
  company: Company;
  onBack: () => void;
  onCompleted: () => void;
};

export function OnboardingReview({
  company,
  onBack,
  onCompleted,
}: OnboardingReviewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profileLabel =
    PROFILE_TYPE_OPTIONS.find((item) => item.value === company.profileType)
      ?.label ?? company.profileType;
  const toneLabel =
    PROPOSAL_TONE_OPTIONS.find((item) => item.value === company.defaultTone)
      ?.label ?? company.defaultTone;

  async function handleComplete() {
    setIsSubmitting(true);
    try {
      const accessToken = await getCurrentAccessToken();
      await completeCompanyOnboarding(accessToken);
      toast.success("Onboarding concluido com sucesso.");
      onCompleted();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel concluir o onboarding.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <ReviewSection title="Perfil">
            <ReviewItem label="Tipo" value={profileLabel} />
            <ReviewItem label="Nome" value={company.name} />
            <ReviewItem label="Segmento" value={company.segment} />
            <ReviewItem label="E-mail" value={company.commercialEmail} />
            <ReviewItem label="WhatsApp" value={company.whatsapp} />
          </ReviewSection>
          <ReviewSection title="Identidade">
            <ReviewItem
              label="Nome nas propostas"
              value={company.tradeName ?? company.name}
            />
            <ReviewItem label="Apresentacao" value={company.presentationText} />
            <ReviewItem label="Responsavel" value={company.responsibleName} />
          </ReviewSection>
          <ReviewSection title="Padroes das propostas">
            <ReviewItem
              label="Validade"
              value={`${company.defaultValidityDays} dias`}
            />
            <ReviewItem label="Prazo" value={company.defaultDeliveryTime} />
            <ReviewItem
              label="Pagamento"
              value={company.defaultPaymentConditions}
            />
            <ReviewItem label="Tom padrao" value={toneLabel} />
          </ReviewSection>
        </div>
        <BrandPreview
          company={company}
          brand={{
            logoUrl: company.logoUrl ?? "",
            lightLogoUrl: company.lightLogoUrl ?? "",
            primaryColor: company.primaryColor,
            secondaryColor: company.secondaryColor,
            accentColor: company.accentColor,
            backgroundColor: company.backgroundColor,
            surfaceColor: company.surfaceColor,
            textColor: company.textColor,
            visualPreference: company.visualPreference,
            fontPreference: company.fontPreference,
            visualStyle: company.visualStyle,
            borderRadius: company.borderRadius,
          }}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Voltar e corrigir
        </Button>
        <Button type="button" disabled={isSubmitting} onClick={handleComplete}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : null}
          Confirmar e ir para o painel
        </Button>
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border/60 pb-4 last:border-b-0">
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      <dl className="space-y-2 text-sm">{children}</dl>
    </div>
  );
}

function ReviewItem({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value?.trim() || "—"}</dd>
    </div>
  );
}
