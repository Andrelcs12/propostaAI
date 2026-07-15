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
    <section className="border-y bg-secondary/45 py-16 md:py-20">
      <div className="container-page">
        <SectionHeading
          title="Feito para quem vende serviços."
          description="A primeira versão é pensada para quem precisa apresentar valor com clareza antes de fechar um projeto."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {landingConfig.audiences.map((audience) => (
            <Card key={audience.title} className="landing-card">
              <CardHeader>
                <CardTitle className="text-lg">{audience.title}</CardTitle>
                <CardDescription>{audience.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
