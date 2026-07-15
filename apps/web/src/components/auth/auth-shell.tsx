import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border bg-card shadow-sm md:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden border-r bg-secondary/60 p-8 md:flex md:flex-col md:justify-between">
          <Logo />
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-primary">Proposta AI</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal">
                Venda servicos com uma proposta mais clara.
              </h1>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Configure sua empresa uma vez e use essa base para criar
                propostas comerciais consistentes.
              </p>
            </div>
            <div className="grid gap-3 text-sm">
              {[
                "Dados da empresa",
                "Identidade visual",
                "Fluxo de propostas",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-md border bg-card px-3 py-2 text-muted-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Base inicial para freelancers, agencias e consultores.
          </p>
        </section>

        <div className="w-full p-5 sm:p-8">
          <div className="mb-6 flex justify-center md:hidden">
            <Logo />
          </div>
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              {children}
              <div className="mt-6 text-center text-sm text-muted-foreground">
                {footer}
              </div>
            </CardContent>
          </Card>
          <div className="mt-6 text-center text-sm">
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Voltar para a landing
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
