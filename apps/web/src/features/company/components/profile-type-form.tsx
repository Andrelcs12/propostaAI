"use client";

import { Building2, Check, Loader2, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
    <div className="space-y-6">
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
              className={cn(
                "onboarding-choice group relative rounded-xl p-4 text-left",
                isActive && "onboarding-choice-active",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground/70 group-hover:text-primary",
                  )}
                >
                  <Icon className="size-5" />
                </div>
                {isActive ? (
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="size-3.5" />
                  </span>
                ) : (
                  <span className="size-6 rounded-full border-2 border-foreground/15" />
                )}
              </div>

              <p className="mt-4 text-base font-semibold text-foreground">
                {option.label}
              </p>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      <Button
        type="button"
        disabled={isSubmitting}
        className="min-w-[140px]"
        onClick={handleSubmit}
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : null}
        {submitLabel}
      </Button>
    </div>
  );
}
