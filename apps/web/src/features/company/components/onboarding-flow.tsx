"use client";

import {
  ArrowLeft,
  Building2,
  Check,
  ClipboardCheck,
  Palette,
  SlidersHorizontal,
  UserCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Company } from "../types/company";
import { CompanyBasicForm } from "./company-basic-form";
import { CompanyBrandForm } from "./company-brand-form";
import { CompanyDefaultsForm } from "./company-defaults-form";
import { CompanyIdentityForm } from "./company-identity-form";
import { OnboardingReview } from "./onboarding-review";
import { ProfileTypeForm } from "./profile-type-form";

type OnboardingFlowProps = {
  initialCompany: Company | null;
  initialStep: number;
};

const steps = [
  {
    number: 1,
    title: "Tipo de perfil",
    shortTitle: "Perfil",
    icon: UserCircle2,
  },
  {
    number: 2,
    title: "Informacoes principais",
    shortTitle: "Dados",
    icon: Building2,
  },
  {
    number: 3,
    title: "Identidade visual",
    shortTitle: "Marca",
    icon: Palette,
  },
  {
    number: 4,
    title: "Padroes das propostas",
    shortTitle: "Padroes",
    icon: SlidersHorizontal,
  },
  {
    number: 5,
    title: "Revisao",
    shortTitle: "Revisao",
    icon: ClipboardCheck,
  },
] as const;

function normalizeStep(step: number) {
  if (step <= 1) return 1;
  if (step >= 5) return 5;
  return step;
}

export function OnboardingFlow({
  initialCompany,
  initialStep,
}: OnboardingFlowProps) {
  const router = useRouter();
  const [company, setCompany] = useState(initialCompany);
  const [step, setStep] = useState(normalizeStep(initialStep));

  function handleSaved(nextCompany: Company, nextStep: number) {
    setCompany(nextCompany);
    setStep(nextStep);
    router.refresh();
  }

  const stepDescription: Record<number, string> = {
    1: "Escolha como voce utiliza o PropostaAI.",
    2:
      company?.profileType === "INDIVIDUAL"
        ? "Configure seus dados profissionais principais."
        : "Configure os dados principais da empresa.",
    3: "Defina logo, cores e apresentacao comercial.",
    4: "Configure prazos, cobranca e tom. A IA usa isso como base em toda proposta.",
    5: "Revise tudo antes de concluir.",
  };

  const currentStep = steps[step - 1];
  const CurrentIcon = currentStep?.icon;

  return (
    <div>
      <div className="border-b border-border/60 bg-muted/20 px-5 py-4 sm:px-7">
        <div className="mb-4 flex items-center justify-between gap-3 text-xs">
          <span className="font-medium text-foreground/80">Progresso</span>
          <span className="font-semibold text-foreground">
            Etapa {step} de {steps.length}
          </span>
        </div>

        <div className="flex items-center">
          {steps.map((item, index) => {
            const isActive = item.number === step;
            const isCompleted = item.number < step;
            const isLast = index === steps.length - 1;

            return (
              <div key={item.number} className="flex flex-1 items-center">
                <div className="flex min-w-0 flex-col items-center gap-1.5">
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full border-2 text-xs font-bold transition-all sm:size-9",
                      isActive &&
                        "border-primary bg-primary text-primary-foreground shadow-[0_0_0_4px_color-mix(in_oklch,var(--primary)_22%,transparent)]",
                      isCompleted &&
                        !isActive &&
                        "border-primary bg-primary/15 text-primary",
                      !isActive &&
                        !isCompleted &&
                        "onboarding-step-pending border-2",
                    )}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="size-3.5 sm:size-4" />
                    ) : (
                      item.number
                    )}
                  </div>
                  <span
                    className={cn(
                      "hidden max-w-[4.5rem] truncate text-center text-[11px] font-semibold sm:block sm:max-w-none sm:text-xs",
                      isActive && "text-primary",
                      isCompleted && !isActive && "text-primary/80",
                      !isActive && !isCompleted && "onboarding-step-label-pending",
                    )}
                  >
                    {item.shortTitle}
                  </span>
                </div>

                {!isLast ? (
                  <div
                    className={cn(
                      "onboarding-step-track mx-1 mb-5 h-0.5 flex-1 sm:mx-2",
                      isCompleted && "bg-primary/50",
                    )}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-6 sm:px-7 sm:py-7">
        <div className="mb-6 flex items-start gap-3">
          {CurrentIcon ? (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CurrentIcon className="size-5" />
            </div>
          ) : null}
          <div>
            <h2 className="text-lg font-semibold sm:text-xl">
              {currentStep?.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {stepDescription[step]}
            </p>
          </div>
        </div>

        {step === 1 ? (
          <ProfileTypeForm
            company={company}
            submitLabel="Continuar"
            onSaved={(nextCompany) => handleSaved(nextCompany, 2)}
          />
        ) : null}

        {step === 2 ? (
          <div className="space-y-5">
            <BackButton onClick={() => setStep(1)} />
            <CompanyBasicForm
              company={company}
              submitLabel="Continuar"
              onSaved={(nextCompany) => handleSaved(nextCompany, 3)}
            />
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-8">
            <BackButton onClick={() => setStep(2)} />
            <CompanyBrandForm
              company={company}
              submitLabel="Salvar identidade visual"
              embedded
              onSaved={setCompany}
            />
            <div className="border-t border-border/60 pt-8">
              <CompanyIdentityForm
                company={company}
                submitLabel="Continuar"
                onSaved={(nextCompany) => handleSaved(nextCompany, 4)}
              />
            </div>
          </div>
        ) : null}

        {step === 4 ? (
          <div className="space-y-5">
            <BackButton onClick={() => setStep(3)} />
            <CompanyDefaultsForm
              embedded
              company={company}
              submitLabel="Continuar"
              onSaved={(nextCompany) => handleSaved(nextCompany, 5)}
            />
          </div>
        ) : null}

        {step === 5 && company ? (
          <OnboardingReview
            company={company}
            onBack={() => setStep(4)}
            onCompleted={() => {
              router.refresh();
              router.push("/painel");
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-2 px-2 text-muted-foreground hover:text-primary"
      onClick={onClick}
    >
      <ArrowLeft className="size-4" />
      Voltar
    </Button>
  );
}
