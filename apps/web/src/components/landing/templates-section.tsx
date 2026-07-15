import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { landingConfig } from "@/config/landing";
import { SectionHeading } from "./section-heading";
import { StatusBadge } from "./status-badge";

export function TemplatesSection() {
  return (
    <section id="templates" className="border-y bg-secondary/45 py-16 md:py-20">
      <div className="container-page">
        <SectionHeading
          title="Estruturas profissionais sem depender de layouts aleatórios."
          description="O Proposta AI trabalhará com estruturas controladas, para que cada proposta tenha uma lógica comercial clara."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {landingConfig.templates.map((template) => (
            <Card key={template.name} className="landing-card">
              <CardHeader>
                <div className="rounded-lg border bg-background p-3">
                  <div className="mb-3 h-4 w-20 rounded-full bg-primary/25" />
                  <div className="space-y-2">
                    <div className="h-3 rounded-full bg-foreground/20" />
                    <div className="h-3 w-4/5 rounded-full bg-foreground/10" />
                    <div className="h-3 w-2/3 rounded-full bg-foreground/10" />
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <StatusBadge muted>{template.status}</StatusBadge>
                </div>
                <CardDescription>{template.audience}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
