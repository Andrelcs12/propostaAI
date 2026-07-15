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
    <section id="precos" className="border-y bg-secondary/45 py-16 md:py-20">
      <div className="container-page">
        <SectionHeading
          centered
          title="Preços simples para começar."
          description="O plano gratuito permite preparar a base. Os planos pagos estão marcados como futuros, sem cobrança ativa nesta etapa."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {landingConfig.pricing.map((plan) => (
            <Card
              key={plan.name}
              className={`landing-card ${plan.highlighted ? "border-primary shadow-sm" : ""}`}
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>{plan.name}</CardTitle>
                  <StatusBadge muted={plan.status !== "Disponível"}>
                    {plan.status}
                  </StatusBadge>
                </div>
                <p className="text-3xl font-semibold">{plan.price}</p>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex h-full flex-col gap-6">
                <ul className="grid gap-3 text-sm">
                  {plan.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  variant={plan.highlighted ? "default" : "outline"}
                  className="mt-auto"
                >
                  <Link href={ctaHref}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
