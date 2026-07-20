import { landingConfig } from "@/config/landing";
import { SectionHeading } from "./section-heading";

export function EarlyAccessSection() {
  return (
    <section className="container-page py-16 md:py-24">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border-b p-6 md:p-10 lg:border-r lg:border-b-0">
            <SectionHeading
              eyebrow="Por trás do produto"
              title="Construído para propostas reais, não slides genéricos."
              description="PropostaAI nasce da rotina de quem vende serviço: precisa parecer profissional, explicar valor com clareza e não perder horas formatando documento."
            />

            <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {landingConfig.valueStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border bg-background/70 px-4 py-4"
                >
                  <p className="text-3xl font-semibold tracking-tight text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-secondary/35 p-6 md:p-10">
            <p className="text-sm font-semibold text-primary">
              Princípios do produto
            </p>
            <div className="mt-5 grid gap-4">
              {landingConfig.earlyAccessPrinciples.map((principle) => {
                const Icon = principle.icon;

                return (
                  <div
                    key={principle.title}
                    className="flex gap-4 rounded-xl border bg-card/80 p-4"
                  >
                    <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="font-medium">{principle.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
