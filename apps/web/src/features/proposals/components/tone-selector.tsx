"use client";

import { PROPOSAL_TONE_OPTIONS } from "@/features/company/types/company";
import type { ProposalTone } from "../types/proposal";

type ToneSelectorProps = {
  value: ProposalTone;
  disabled?: boolean;
  onChange: (tone: ProposalTone) => void;
};

export function ToneSelector({ value, disabled, onChange }: ToneSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {PROPOSAL_TONE_OPTIONS.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`rounded-md border p-4 text-left transition-colors ${
              isActive
                ? "border-primary bg-primary/5"
                : "bg-card hover:border-primary/40"
            }`}
          >
            <p className="font-medium">{option.label}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {option.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
