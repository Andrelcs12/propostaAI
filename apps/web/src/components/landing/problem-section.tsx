import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { landingConfig } from "@/config/landing";
import { SectionHeading } from "./section-heading";

export function ProblemSection() {
  return (
    <section id="problema" className="border-y bg-secondary/45 py-16 md:py-20">
      <div className="container-page">
        <SectionHeading
          title="Criar uma proposta não deveria significar começar tudo de novo."
          description="O problema raramente é falta de capacidade. É falta de processo, padrão e personalização sem retrabalho."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {landingConfig.problems.map((problem) => (
            <Card key={problem.title} className="landing-card">
              <CardHeader>
                <problem.icon className="size-5 text-primary" />
                <CardTitle className="text-lg">{problem.title}</CardTitle>
                <CardDescription>{problem.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
