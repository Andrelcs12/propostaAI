"use client";

import { Building2, UserRound } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  PROFILE_TYPE_OPTIONS,
  type Company,
  type ProfileType,
} from "../types/company";
import { getCurrentAccessToken } from "../services/session-token.service";
import { updateProfileType } from "../services/company.service";

type ProfileTypeFormProps = {
  company: Company | null;
  submitLabel: string;
  onSaved?: (company: Company) => void;
};

export function ProfileTypeForm({
  company,
  submitLabel,
  onSaved,
}: ProfileTypeFormProps) {
  const [selected, setSelected] = useState<ProfileType>(
    company?.profileType ?? "COMPANY",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const accessToken = await getCurrentAccessToken();
      const result = await updateProfileType(accessToken, {
        profileType: selected,
      });
      toast.success("Tipo de perfil salvo.");
      if (result.company) {
        onSaved?.(result.company);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel salvar o tipo de perfil.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground">
        Como voce utiliza o PropostaAI?
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {PROFILE_TYPE_OPTIONS.map((option) => {
          const Icon = option.value === "COMPANY" ? Building2 : UserRound;
          const isActive = selected === option.value;

          return (
            <button
              key={option.value}
              type="button"
              disabled={isSubmitting}
              onClick={() => setSelected(option.value)}
              className={`rounded-md border p-4 text-left transition-colors ${
                isActive
                  ? "border-primary bg-primary/5"
                  : "bg-card hover:border-primary/40"
              }`}
            >
              <Icon
                className={`mb-3 size-5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
              />
              <p className="font-medium">{option.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>
      <Button type="button" disabled={isSubmitting} onClick={handleSubmit}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : null}
        {submitLabel}
      </Button>
    </div>
  );
}
