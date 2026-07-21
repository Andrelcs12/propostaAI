"use client";

import { BUSINESS_SEGMENT_OPTIONS } from "@novely/shared";
import { Label } from "@/components/ui/label";

const selectClassName =
  "h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

type SegmentSelectProps = {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (value: string) => void;
};

export function SegmentSelect({
  id,
  label,
  value,
  disabled = false,
  required = false,
  onChange,
}: SegmentSelectProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        className={selectClassName}
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="" disabled={required}>
          Selecione um segmento
        </option>
        {BUSINESS_SEGMENT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
