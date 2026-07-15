import { Check, X } from "lucide-react";
import { landingConfig } from "@/config/landing";
import { SectionHeading } from "./section-heading";

export function ComparisonSection() {
  return (
    <section className="container-page py-16 md:py-20">
      <SectionHeading
        centered
        title="Processo tradicional vs. Proposta AI"
        description="A ideia não é adicionar mais uma ferramenta solta. É organizar a base comercial para reduzir improviso."
      />
      <div className="mt-10 grid gap-3">
        {landingConfig.comparison.map(([traditional, proposta]) => (
          <div
            key={traditional}
            className="grid gap-3 rounded-lg border bg-card p-3 md:grid-cols-2"
          >
            <div className="flex items-center gap-3 rounded-md bg-secondary/60 px-3 py-3 text-sm text-muted-foreground">
              <X className="size-4 shrink-0 text-destructive" />
              {traditional}
            </div>
            <div className="flex items-center gap-3 rounded-md bg-primary/10 px-3 py-3 text-sm font-medium text-foreground">
              <Check className="size-4 shrink-0 text-primary" />
              {proposta}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
