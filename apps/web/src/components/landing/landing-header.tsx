"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { landingConfig } from "@/config/landing";

type LandingHeaderProps = {
  isAuthenticated: boolean;
};

export function LandingHeader({ isAuthenticated }: LandingHeaderProps) {
  const [open, setOpen] = useState(false);
  const primaryHref = isAuthenticated ? "/painel" : "/cadastro";

  return (
    <header className="sticky top-0 z-30 border-b bg-background/92 backdrop-blur-xl">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav
          aria-label="Navegação principal"
          className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex"
        >
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
        <div className="hidden items-center gap-2 md:flex">
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
                <Link href="/cadastro">Criar conta grátis</Link>
              </Button>
            </>
          )}
        </div>
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md border bg-card md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t bg-background md:hidden">
          <nav
            className="container-page grid gap-2 py-4 text-sm"
            aria-label="Navegação mobile"
          >
            {landingConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 grid gap-2 border-t pt-4">
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
                      Criar conta grátis
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
