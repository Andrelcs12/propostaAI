import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { landingConfig } from "@/config/landing";
import { SectionHeading } from "./section-heading";

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="container-page py-16 md:py-20">
      <SectionHeading
        centered
        title="Como funciona"
        description="Um fluxo simples para transformar dados comerciais em uma base pronta para propostas melhores."
      />
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {landingConfig.howItWorks.map((step, index) => (
          <Card key={step.title} className="landing-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <step.icon className="size-5 text-primary" />
                <span className="font-mono text-sm text-muted-foreground">
                  0{index + 1}
                </span>
              </div>
              <CardTitle className="text-lg">{step.title}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
