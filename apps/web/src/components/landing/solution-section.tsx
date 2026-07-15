import { landingConfig } from "@/config/landing";
import { SectionHeading } from "./section-heading";
import { StatusBadge } from "./status-badge";

export function SolutionSection() {
  return (
    <section className="container-page py-16 md:py-20">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <SectionHeading
          eyebrow="Fluxo controlado"
          title="Sua empresa configurada uma vez. Suas propostas prontas para evoluir."
          description="A base atual já prepara a empresa e a identidade visual. As etapas de criação e compartilhamento entram de forma controlada nas próximas versões."
        />
        <div className="grid gap-3">
          {landingConfig.solutionSteps.map((step, index) => (
            <div
              key={step.title}
              className="flex gap-4 rounded-lg border bg-card p-4 shadow-sm"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-medium">{step.title}</h3>
                  <StatusBadge muted={step.status !== "Disponível"}>
                    {step.status}
                  </StatusBadge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {step.status === "Disponível"
                    ? "Base pronta no fluxo atual."
                    : "Planejado para evoluir sem prometer o que ainda não está ativo."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
