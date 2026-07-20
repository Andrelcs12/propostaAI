import { ArrowRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { landingConfig } from "@/config/landing";

type FinalCtaSectionProps = {
  isAuthenticated: boolean;
};

export function FinalCtaSection({ isAuthenticated }: FinalCtaSectionProps) {
  const { finalCta } = landingConfig;

  return (
    <section className="container-page py-16 md:py-24">
      <div className="landing-cta-glow relative overflow-hidden rounded-2xl border bg-card p-8 md:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_oklch,var(--primary)_18%,transparent),transparent_55%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -bottom-10 size-40 rounded-full bg-primary/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Sparkles className="size-4" />
            Pronto para testar na prática
          </span>

          <h2 className="mt-6 text-3xl font-semibold tracking-normal md:text-5xl">
            {finalCta.title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            {finalCta.subtitle}
          </p>

          <ul className="mx-auto mt-8 flex max-w-xl flex-col gap-3 text-left sm:items-center">
            {finalCta.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-center gap-3 text-sm text-foreground/90 sm:text-base"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/12">
                  <Check className="size-3.5 text-primary" />
                </span>
                {bullet}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="min-w-[220px]">
              <Link href={isAuthenticated ? "/painel" : "/cadastro"}>
                {isAuthenticated ? "Acessar painel" : "Criar conta grátis"}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            {!isAuthenticated ? (
              <Button asChild variant="outline" size="lg" className="min-w-[180px]">
                <Link href="/login">Já tenho conta</Link>
              </Button>
            ) : (
              <Button asChild variant="outline" size="lg" className="min-w-[180px]">
                <Link href="/propostas/nova">Nova proposta</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
