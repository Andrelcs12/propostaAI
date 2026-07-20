"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  { number: 1, title: "Tipo de perfil" },
  { number: 2, title: "Informacoes principais" },
  { number: 3, title: "Identidade visual" },
  { number: 4, title: "Padroes das propostas" },
  { number: 5, title: "Revisao" },
];

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
    4: "Defina valores padrao para futuras propostas.",
    5: "Revise tudo antes de concluir.",
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-5">
        {steps.map((item) => (
          <div
            key={item.number}
            className={`rounded-md border px-4 py-3 text-sm ${
              item.number === step
                ? "border-primary bg-primary/5 text-primary"
                : item.number < step
                  ? "border-primary/30 bg-card text-foreground"
                  : "bg-card text-muted-foreground"
            }`}
          >
            <span className="font-medium">Etapa {item.number}</span>
            <p>{item.title}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[step - 1]?.title}</CardTitle>
          <CardDescription>{stepDescription[step]}</CardDescription>
        </CardHeader>
        <CardContent>
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
                onSaved={setCompany}
              />
              <CompanyIdentityForm
                company={company}
                submitLabel="Continuar"
                onSaved={(nextCompany) => handleSaved(nextCompany, 4)}
              />
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-5">
              <BackButton onClick={() => setStep(3)} />
              <CompanyDefaultsForm
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
        </CardContent>
      </Card>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" variant="ghost" className="px-0" onClick={onClick}>
      <ArrowLeft />
      Voltar
    </Button>
  );
}
