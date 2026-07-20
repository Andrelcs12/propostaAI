import { ArrowRight, Check, X } from "lucide-react";
import { landingConfig } from "@/config/landing";
import { SectionHeading } from "./section-heading";

export function ComparisonSection() {
  const { beforeLabel, afterLabel, rows } = landingConfig.comparison;

  return (
    <section className="container-page py-16 md:py-24">
      <SectionHeading
        centered
        eyebrow="Menos improviso"
        title="Processo tradicional vs. PropostaAI"
        description="Não é mais uma ferramenta solta. É a base comercial que faltava entre a conversa com o cliente e o documento que fecha o projeto."
      />

      <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="grid border-b md:grid-cols-2">
          <div className="border-b bg-secondary/50 px-5 py-4 md:border-r md:border-b-0">
            <p className="text-sm font-semibold text-muted-foreground">
              {beforeLabel}
            </p>
          </div>
          <div className="bg-primary/8 px-5 py-4">
            <p className="text-sm font-semibold text-primary">{afterLabel}</p>
          </div>
        </div>

        <div className="divide-y">
          {rows.map(([traditional, proposta]) => (
            <div
              key={traditional}
              className="grid md:grid-cols-2 md:divide-x"
            >
              <div className="flex items-start gap-3 px-5 py-4 text-sm text-muted-foreground">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                  <X className="size-3.5 text-destructive" />
                </span>
                <span>{traditional}</span>
              </div>
              <div className="flex items-start gap-3 bg-primary/[0.03] px-5 py-4 text-sm font-medium text-foreground">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/12">
                  <Check className="size-3.5 text-primary" />
                </span>
                <span className="flex items-center gap-2">
                  {proposta}
                  <ArrowRight className="hidden size-3.5 text-primary/70 md:inline" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
