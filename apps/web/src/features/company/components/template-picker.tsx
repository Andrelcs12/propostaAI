"use client";

import { cn } from "@/lib/utils";
import {
  PROPOSAL_TEMPLATES,
  type VisualStyleId,
} from "@/config/templates";

type TemplatePickerProps = {
  value: VisualStyleId;
  disabled?: boolean;
  onChange: (value: VisualStyleId) => void;
};

export function TemplatePicker({
  value,
  disabled,
  onChange,
}: TemplatePickerProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {PROPOSAL_TEMPLATES.map((template) => {
        const selected = value === template.id;

        return (
          <button
            key={template.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(template.id)}
            className={cn(
              "group rounded-xl border p-4 text-left transition-all",
              selected
                ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                : "border-border bg-card hover:border-primary/40 hover:bg-muted/30",
              disabled && "cursor-not-allowed opacity-60",
            )}
          >
            <div className="mb-3 overflow-hidden rounded-lg border bg-background">
              <TemplateMiniPreview templateId={template.id} selected={selected} />
            </div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium">{template.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {template.description}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                {template.badge}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function TemplateMiniPreview({
  templateId,
  selected,
}: {
  templateId: VisualStyleId;
  selected: boolean;
}) {
  const accent = selected ? "bg-primary" : "bg-muted-foreground/40";

  if (templateId === "MODERN") {
    return (
      <div className="p-3">
        <div className={cn("mb-2 h-8 rounded-md", accent, "opacity-80")} />
        <div className="space-y-1.5">
          <div className="h-2 w-2/3 rounded bg-foreground/15" />
          <div className="h-2 w-full rounded bg-foreground/10" />
          <div className="h-2 w-5/6 rounded bg-foreground/10" />
        </div>
      </div>
    );
  }

  if (templateId === "PREMIUM") {
    return (
      <div className="p-4">
        <div className="mb-3 h-1.5 w-8 rounded-full bg-foreground/20" />
        <div className="h-3 w-1/2 rounded bg-foreground/20" />
        <div className="mt-4 space-y-2">
          <div className="h-2 w-full rounded bg-foreground/10" />
          <div className="h-2 w-4/5 rounded bg-foreground/10" />
        </div>
      </div>
    );
  }

  if (templateId === "BOLD") {
    return (
      <div className="p-3">
        <div className={cn("mb-2 h-10 rounded-md", accent)} />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-8 rounded bg-foreground/10" />
          <div className="h-8 rounded bg-foreground/15" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="mb-2 flex items-center gap-2">
        <div className={cn("size-6 rounded", accent, "opacity-70")} />
        <div className="h-2 w-16 rounded bg-foreground/15" />
      </div>
      <div className="rounded border border-foreground/10 p-2">
        <div className="h-2 w-2/3 rounded bg-foreground/15" />
        <div className="mt-2 h-2 w-full rounded bg-foreground/10" />
      </div>
    </div>
  );
}
