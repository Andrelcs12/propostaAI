import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { landingConfig } from "@/config/landing";

export function LandingFooter() {
  return (
    <footer className="border-t bg-card/80">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.3fr_0.85fr_0.85fr] md:py-14">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            {landingConfig.footer.tagline}
          </p>
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground/80">
            {landingConfig.footer.madeBy}
          </p>
          <Button asChild className="mt-6" variant="outline" size="sm">
            <Link href="/cadastro">
              Começar gratuitamente
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div>
          <p className="text-sm font-semibold">Produto</p>
          <nav className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
            {landingConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-sm font-semibold">Conta</p>
          <nav className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
            <Link href="/login" className="transition-colors hover:text-foreground">
              Login
            </Link>
            <Link href="/cadastro" className="transition-colors hover:text-foreground">
              Cadastro
            </Link>
            <Link href="/painel" className="transition-colors hover:text-foreground">
              Painel
            </Link>
            <span className="text-muted-foreground/65">Termos de Uso</span>
            <span className="text-muted-foreground/65">
              Política de Privacidade
            </span>
          </nav>
        </div>
      </div>

      <div className="border-t">
        <div className="container-page flex flex-col gap-2 py-5 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2026 PropostaAI. Todos os direitos reservados.</p>
          <p>Feito para quem vende serviços com clareza.</p>
        </div>
      </div>
    </footer>
  );
}
