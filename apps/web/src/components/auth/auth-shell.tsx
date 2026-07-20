import {
  BadgeCheck,
  Building2,
  Check,
  Palette,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { PropostaLogo } from "@/components/brand/proposta-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const authHighlights = [
  {
    icon: Building2,
    title: "Dados da empresa",
    description: "Contatos, serviços e textos comerciais.",
  },
  {
    icon: Palette,
    title: "Identidade visual",
    description: "Cores, templates e Brand Kit.",
  },
  {
    icon: Sparkles,
    title: "Propostas com IA",
    description: "Conteúdo claro com preview ao vivo.",
  },
] as const;

type AuthShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthShell({
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="app-gradient-bg flex h-dvh items-center justify-center overflow-hidden px-4 py-4 md:py-6">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>

      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-xl backdrop-blur-sm md:max-h-[min(620px,calc(100dvh-3rem))] md:grid-cols-[0.92fr_1.08fr]">
        <AuthSidePanel />

        <div className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-y-auto p-5 sm:p-7 md:max-h-none md:overflow-visible md:p-8">
          <div className="mb-5 flex justify-center md:hidden">
            <PropostaLogo className="size-9" />
          </div>
          <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="px-0 pb-4">
              <CardTitle className="text-2xl">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              {children}
              <div className="mt-5 text-center text-sm text-muted-foreground">
                {footer}
              </div>
            </CardContent>
          </Card>
          <div className="mt-5 text-center text-sm md:mt-auto md:pt-4">
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              Voltar para a landing
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function AuthSidePanel() {
  return (
    <section className="relative hidden min-h-0 overflow-hidden border-r border-border/70 md:flex md:flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--primary)_14%,transparent),transparent_50%)]"
      />

      <div className="relative flex h-full min-h-0 flex-col justify-between gap-5 p-6 lg:p-7">
        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <PropostaLogo className="size-8" wordmarkClassName="text-sm" />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
              <BadgeCheck className="size-3" />
              3 propostas grátis
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-semibold leading-tight tracking-tight lg:text-[1.65rem]">
              Propostas claras que transmitem valor.
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Configure sua empresa uma vez e reutilize a base em cada
              oportunidade.
            </p>
          </div>

          <div className="space-y-2">
            {authHighlights.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center gap-3 rounded-lg border border-border/70 bg-background/70 px-3 py-2.5"
                >
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-none">
                      {item.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3 border-t border-border/60 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {["Sem cartão", "Preview ao vivo", "Templates prontos"].map(
              (tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border bg-background/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  <Check className="size-2.5 text-primary" />
                  {tag}
                </span>
              ),
            )}
          </div>
          <p className="text-[11px] leading-5 text-muted-foreground">
            Para freelancers, agências, consultores e prestadores B2B.
          </p>
        </div>
      </div>
    </section>
  );
}
