import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { PropostaLogo } from "@/components/brand/proposta-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type OnboardingApiErrorProps = {
  message: string;
  status: number;
};

export function OnboardingApiError({ message, status }: OnboardingApiErrorProps) {
  const isDatabaseUnavailable =
    status === 503 ||
    status === 500 ||
    /banco de dados|postgresql|docker|db:up|db:migrate/i.test(message);

  return (
    <main className="app-gradient-bg relative min-h-screen">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <section className="container-page relative flex min-h-screen flex-col items-center justify-center py-10">
        <PropostaLogo className="mb-8 size-10" />
        <Card className="app-panel w-full max-w-lg border-border/80">
          <CardHeader>
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
              <div>
                <CardTitle>Nao foi possivel carregar o onboarding</CardTitle>
                <CardDescription className="mt-2">{message}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isDatabaseUnavailable ? (
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  Escolha uma das opcoes:
                </p>
                <div className="mt-3 space-y-3">
                  <div>
                    <p className="font-medium text-foreground">
                      Opcao A — Docker local
                    </p>
                    <ol className="mt-1 list-decimal space-y-1 pl-5">
                      <li>Abra o Docker Desktop e espere ficar em execucao</li>
                      <li>Execute `npm run db:up` na raiz do projeto</li>
                      <li>Execute `npm run db:migrate`</li>
                    </ol>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Opcao B — Supabase (sem Docker)
                    </p>
                    <ol className="mt-1 list-decimal space-y-1 pl-5">
                      <li>
                        Copie a connection string em Supabase → Project Settings
                        → Database
                      </li>
                      <li>
                        Cole em `apps/api/.env` como `DATABASE_URL` e
                        `DIRECT_DATABASE_URL`
                      </li>
                      <li>Execute `npm run db:migrate`</li>
                    </ol>
                  </div>
                  <p>Depois reinicie a API e clique em Tentar novamente.</p>
                </div>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/onboarding">Tentar novamente</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/painel">Ir para o painel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
