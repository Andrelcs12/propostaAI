import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { landingConfig } from "@/config/landing";

export function LandingFooter() {
  return (
    <footer className="border-t bg-card py-10">
      <div className="container-page grid gap-8 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
            Propostas comerciais mais claras, profissionais e personalizadas
            para serviços B2B.
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            © 2026 Proposta AI. Todos os direitos reservados.
          </p>
        </div>
        <div>
          <p className="font-medium">Produto</p>
          <nav className="mt-3 grid gap-2 text-sm text-muted-foreground">
            {landingConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <p className="font-medium">Conta</p>
          <nav className="mt-3 grid gap-2 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground">
              Login
            </Link>
            <Link href="/cadastro" className="hover:text-foreground">
              Cadastro
            </Link>
            <span className="text-muted-foreground/70">Termos de Uso</span>
            <span className="text-muted-foreground/70">
              Política de Privacidade
            </span>
          </nav>
        </div>
      </div>
    </footer>
  );
}
