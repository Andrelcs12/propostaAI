"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { landingConfig } from "@/config/landing";

type LandingHeaderProps = {
  isAuthenticated: boolean;
};

export function LandingHeader({ isAuthenticated }: LandingHeaderProps) {
  const [open, setOpen] = useState(false);
  const primaryHref = isAuthenticated ? "/painel" : "/cadastro";

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Logo />
        <nav
          aria-label="Navegacao principal"
          className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex"
        >
          {landingConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <Button asChild size="sm">
              <Link href="/painel">Acessar painel</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/cadastro">Criar conta gratis</Link>
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex size-10 cursor-pointer items-center justify-center rounded-md border border-border bg-card"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-border/80 bg-background md:hidden">
          <nav
            className="container-page grid gap-1 py-4 text-sm"
            aria-label="Navegacao mobile"
          >
            {landingConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="cursor-pointer rounded-lg px-3 py-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid gap-2 border-t border-border/80 pt-4">
              {isAuthenticated ? (
                <Button asChild>
                  <Link href="/painel" onClick={() => setOpen(false)}>
                    Acessar painel
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline">
                    <Link href="/login" onClick={() => setOpen(false)}>
                      Entrar
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href={primaryHref} onClick={() => setOpen(false)}>
                      Criar conta gratis
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
