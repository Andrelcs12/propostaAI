import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicProposalNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="max-w-md rounded-xl border bg-background p-8 text-center">
        <h1 className="text-xl font-semibold">Proposta indisponivel</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Este link expirou, foi desativado ou nao existe mais.
        </p>
        <Button asChild className="mt-6">
          <Link href="/">Ir para o PropostaAI</Link>
        </Button>
      </div>
    </div>
  );
}
