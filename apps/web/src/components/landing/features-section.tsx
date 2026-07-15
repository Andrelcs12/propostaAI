import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { landingConfig } from "@/config/landing";
import { SectionHeading } from "./section-heading";
import { StatusBadge } from "./status-badge";

export function FeaturesSection() {
  return (
    <section id="recursos" className="border-y bg-secondary/45 py-16 md:py-20">
      <div className="container-page">
        <SectionHeading
          centered
          eyebrow="Recursos"
          title="Uma base comercial organizada antes da proposta existir."
          description="Recursos disponíveis aparecem como disponíveis. O restante está marcado como futuro para manter a comunicação honesta."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {landingConfig.features.map((feature) => (
            <Card
              key={feature.title}
              className={
                feature.status === "Disponível"
                  ? "landing-card"
                  : "landing-card opacity-85"
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <feature.icon className="size-5 text-primary" />
                  <StatusBadge muted={feature.status !== "Disponível"}>
                    {feature.status}
                  </StatusBadge>
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
