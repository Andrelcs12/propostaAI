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
import { CompanyCommercialForm } from "./company-commercial-form";

type OnboardingFlowProps = {
  initialCompany: Company | null;
  initialStep: number;
};

const steps = [
  { number: 1, title: "Sua empresa" },
  { number: 2, title: "Identidade visual" },
  { number: 3, title: "Dados comerciais" },
];

export function OnboardingFlow({
  initialCompany,
  initialStep,
}: OnboardingFlowProps) {
  const router = useRouter();
  const [company, setCompany] = useState(initialCompany);
  const [step, setStep] = useState(Math.min(Math.max(initialStep, 1), 3));

  function handleSaved(nextCompany: Company, nextStep: number) {
    setCompany(nextCompany);
    setStep(nextStep);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {steps.map((item) => (
          <div
            key={item.number}
            className={`rounded-md border px-4 py-3 text-sm ${
              item.number === step
                ? "border-primary bg-primary/5 text-primary"
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
          <CardDescription>
            {step === 1 ? "Configure os dados principais da empresa." : null}
            {step === 2
              ? "Defina a base visual que sera usada nas propostas."
              : null}
            {step === 3
              ? "Adicione informacoes comerciais padrao para futuras propostas."
              : null}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <CompanyBasicForm
              company={company}
              submitLabel="Continuar"
              onSaved={(nextCompany) => handleSaved(nextCompany, 2)}
            />
          ) : null}
          {step === 2 ? (
            <div className="space-y-5">
              <Button
                type="button"
                variant="ghost"
                className="px-0"
                onClick={() => setStep(1)}
              >
                <ArrowLeft />
                Voltar
              </Button>
              <CompanyBrandForm
                company={company}
                submitLabel="Continuar"
                onSaved={(nextCompany) => handleSaved(nextCompany, 3)}
              />
            </div>
          ) : null}
          {step === 3 ? (
            <div className="space-y-5">
              <Button
                type="button"
                variant="ghost"
                className="px-0"
                onClick={() => setStep(2)}
              >
                <ArrowLeft />
                Voltar
              </Button>
              <CompanyCommercialForm
                company={company}
                submitLabel="Concluir configuracao"
                completeOnSubmit
                onSaved={(nextCompany) => setCompany(nextCompany)}
                onCompleted={() => {
                  router.refresh();
                  router.push("/painel");
                }}
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
