import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { landingConfig } from "@/config/landing";
import { SectionHeading } from "./section-heading";
import { StatusBadge } from "./status-badge";

type PricingSectionProps = {
  isAuthenticated: boolean;
};

export function PricingSection({ isAuthenticated }: PricingSectionProps) {
  const ctaHref = isAuthenticated ? "/painel" : "/cadastro";

  return (
    <section id="precos" className="border-y bg-secondary/45 py-16 md:py-24">
      <div className="container-page">
        <SectionHeading
          centered
          eyebrow="Preços"
          title="Comece grátis. Evolua quando fizer sentido."
          description="Valide o produto com sua operação real. Os planos pagos entram depois, sem surpresa e sem cobrança escondida."
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {landingConfig.pricing.map((plan) => (
            <Card
              key={plan.name}
              className={`landing-card relative flex h-full flex-col overflow-hidden ${
                plan.highlighted
                  ? "border-primary/50 shadow-[0_24px_60px_rgb(15_118_110/0.12)] ring-1 ring-primary/20"
                  : "border-border/80"
              }`}
            >
              {plan.badge ? (
                <div className="absolute top-0 right-0 rounded-bl-xl bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {plan.badge}
                </div>
              ) : null}

              <CardHeader className="gap-3 pb-4">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <StatusBadge muted={plan.status !== "Disponível"}>
                    {plan.status}
                  </StatusBadge>
                </div>
                <div>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-semibold tracking-tight">
                      {plan.price}
                    </p>
                    {plan.period ? (
                      <p className="pb-1 text-sm text-muted-foreground">
                        {plan.period}
                      </p>
                    ) : null}
                  </div>
                  <CardDescription className="mt-3 text-base leading-7">
                    {plan.description}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-6">
                <ul className="grid flex-1 gap-3 text-sm">
                  {plan.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="size-3 text-primary" />
                      </span>
                      <span className="leading-6">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={plan.highlighted ? "default" : "outline"}
                  className="w-full"
                >
                  <Link href={ctaHref}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm text-muted-foreground">
          {landingConfig.pricingNote}
        </p>
      </div>
    </section>
  );
}
