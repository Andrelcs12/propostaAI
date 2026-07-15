import { CheckCircle2 } from "lucide-react";
import { landingConfig } from "@/config/landing";
import { SectionHeading } from "./section-heading";

export function EarlyAccessSection() {
  return (
    <section className="container-page py-16 md:py-20">
      <div className="rounded-xl border bg-card p-6 shadow-sm md:p-8">
        <SectionHeading
          title="Construído para ser usado em propostas reais."
          description="O Proposta AI está sendo desenvolvido com foco em freelancers, agências e prestadores de serviços que precisam apresentar melhor o valor do próprio trabalho."
        />
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          {landingConfig.earlyAccessPrinciples.map((principle) => (
            <div
              key={principle}
              className="flex items-center gap-3 rounded-md border bg-background px-4 py-3 text-sm"
            >
              <CheckCircle2 className="size-4 text-primary" />
              {principle}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
