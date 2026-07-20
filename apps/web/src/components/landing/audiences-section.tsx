import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { landingConfig } from "@/config/landing";
import { SectionHeading } from "./section-heading";

export function AudiencesSection() {
  return (
    <section className="relative overflow-hidden border-y bg-secondary/45 py-16 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_42%)]"
      />
      <div className="container-page relative">
        <SectionHeading
          eyebrow="Para quem vende serviço"
          title="Feito para quem precisa vender antes de executar."
          description="PropostaAI ajuda prestadores B2B a apresentar escopo, valor e investimento com clareza — sem parecer amador nem genérico."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {landingConfig.audiences.map((audience) => {
            const Icon = audience.icon;

            return (
              <Card
                key={audience.title}
                className="landing-card group overflow-hidden border-border/80 bg-card/90"
              >
                <CardHeader className="gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary/15">
                      <Icon className="size-5" />
                    </div>
                    <span className="rounded-full border bg-background/80 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      B2B
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">{audience.title}</CardTitle>
                    <CardDescription className="mt-2 text-base leading-7">
                      {audience.description}
                    </CardDescription>
                  </div>
                  <p className="text-sm font-medium text-primary/90">
                    {audience.benefit}
                  </p>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
