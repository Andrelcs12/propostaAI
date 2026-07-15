import Link from "next/link";
import { Button } from "@/components/ui/button";

type FinalCtaSectionProps = {
  isAuthenticated: boolean;
};

export function FinalCtaSection({ isAuthenticated }: FinalCtaSectionProps) {
  return (
    <section className="container-page py-16 text-center md:py-20">
      <div className="mx-auto max-w-3xl rounded-xl border bg-card p-8 shadow-sm">
        <h2 className="text-3xl font-semibold tracking-normal md:text-4xl">
          Sua próxima proposta pode começar com uma base melhor.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Configure sua empresa e prepare o Proposta AI para transformar a forma
          como você apresenta seus serviços.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href={isAuthenticated ? "/painel" : "/cadastro"}>
              {isAuthenticated ? "Acessar painel" : "Criar conta grátis"}
            </Link>
          </Button>
          {!isAuthenticated ? (
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Entrar</Link>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
