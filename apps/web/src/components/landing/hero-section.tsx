import { ArrowRight, Check, FileText, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { landingConfig } from "@/config/landing";

type HeroSectionProps = {
  isAuthenticated: boolean;
};

export function HeroSection({ isAuthenticated }: HeroSectionProps) {
  const primaryHref = isAuthenticated ? "/painel" : "/cadastro";

  return (
    <section className="container-page grid gap-12 py-16 md:py-24 lg:grid-cols-[1fr_0.95fr] lg:items-center">
      <div className="max-w-3xl">
        <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {landingConfig.hero.badge}
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-normal text-foreground sm:text-5xl lg:text-6xl">
          {landingConfig.hero.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          {landingConfig.hero.subtitle}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href={primaryHref}>
              {landingConfig.hero.primaryCta}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="#como-funciona">{landingConfig.hero.secondaryCta}</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {landingConfig.hero.note}
        </p>
      </div>

      <div className="landing-float rounded-xl border bg-card p-3 shadow-sm">
        <div className="overflow-hidden rounded-lg border bg-background">
          <div className="flex items-center justify-between border-b bg-card px-4 py-3">
            <div>
              <p className="text-xs text-muted-foreground">Proposta AI</p>
              <p className="text-sm font-medium">Painel de propostas</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
              1 de 3 grátis
            </span>
          </div>
          <div className="grid gap-0 md:grid-cols-[130px_1fr]">
            <aside className="hidden border-r bg-secondary/60 p-3 text-xs text-muted-foreground md:grid md:gap-2">
              {["Propostas", "Clientes", "Templates", "Minha empresa"].map(
                (item) => (
                  <span
                    key={item}
                    className={
                      item === "Propostas"
                        ? "rounded-md bg-card px-2 py-2 font-medium text-foreground"
                        : "px-2 py-2"
                    }
                  >
                    {item}
                  </span>
                ),
              )}
            </aside>
            <div className="p-4">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-medium text-primary">
                    Cliente fictício
                  </p>
                  <h3 className="text-lg font-semibold">Clínica Horizonte</h3>
                </div>
                <span className="w-fit rounded-full border bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                  Rascunho
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border bg-card p-4">
                  <FileText className="size-5 text-primary" />
                  <p className="mt-3 text-sm font-medium">
                    Proposta de site institucional
                  </p>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Escopo, prazo, investimento e próximos passos em uma
                    estrutura controlada.
                  </p>
                </div>
                <div className="rounded-lg border bg-card p-4">
                  <Sparkles className="size-5 text-primary" />
                  <p className="mt-3 text-sm font-medium">Brand Kit aplicado</p>
                  <div className="mt-3 flex gap-2">
                    {["#0F766E", "#14B8A6", "#06B6D4"].map((color) => (
                      <span
                        key={color}
                        className="size-6 rounded-full border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3 rounded-lg border bg-card p-4">
                {[
                  "Identidade da empresa",
                  "Texto comercial padrão",
                  "Personalização do cliente",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 border-b py-2 last:border-0"
                  >
                    <Check className="size-4 text-primary" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
