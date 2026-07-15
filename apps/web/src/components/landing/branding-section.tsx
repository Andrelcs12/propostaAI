import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { landingConfig } from "@/config/landing";
import { SectionHeading } from "./section-heading";
import { StatusBadge } from "./status-badge";

export function BrandingSection() {
  return (
    <section className="container-page py-16 md:py-20">
      <SectionHeading
        centered
        eyebrow="Personalização"
        title="Uma proposta alinhada à oportunidade."
        description="O diferencial é tratar identidade visual como parte do processo comercial, não como um detalhe improvisado no final."
      />
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {landingConfig.brandingModes.map((mode) => (
          <Card key={mode.title} className="landing-card overflow-hidden">
            <div
              className="h-2"
              style={{
                background: `linear-gradient(90deg, ${mode.colors.join(", ")})`,
              }}
            />
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-xl">{mode.title}</CardTitle>
                <StatusBadge muted={mode.status !== "Disponível"}>
                  {mode.status}
                </StatusBadge>
              </div>
              <CardDescription>{mode.description}</CardDescription>
              <div className="mt-4 rounded-lg border bg-secondary/50 p-4">
                <div className="mb-4 flex items-center gap-2">
                  {mode.colors.map((color) => (
                    <span
                      key={color}
                      className="size-7 rounded-full border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-2/3 rounded-full bg-foreground/20" />
                  <div className="h-3 w-full rounded-full bg-foreground/10" />
                  <div className="h-3 w-5/6 rounded-full bg-foreground/10" />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
