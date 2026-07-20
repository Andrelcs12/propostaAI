"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/layout/logo";
import { LogoutButton } from "@/components/layout/logout-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppShellProps = {
  profile: {
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
  children: React.ReactNode;
};

const navItems = [
  { href: "/painel", label: "Painel" },
  { href: "/propostas", label: "Propostas" },
  { href: "/configuracoes", label: "Configuracoes" },
];

export function AppShell({ profile, children }: AppShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const initials = profile.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <main className="app-gradient-bg min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-4">
            <Logo />
            <nav className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  asChild
                  variant="ghost"
                  size="sm"
                  className={cn(
                    pathname.startsWith(item.href) &&
                      "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
                  )}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle className="hidden sm:inline-flex" />
            <div className="hidden items-center gap-3 lg:flex">
              <Avatar>
                <AvatarImage
                  src={profile.avatarUrl ?? undefined}
                  alt={profile.name}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="max-w-[12rem] truncate text-sm">
                <p className="truncate font-medium">{profile.name}</p>
                <p className="truncate text-muted-foreground">
                  {profile.email}
                </p>
              </div>
            </div>
            <LogoutButton />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="md:hidden"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-border/70 bg-background/95 md:hidden">
            <nav className="container-page grid gap-1 py-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm transition-colors",
                    pathname.startsWith(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 flex items-center justify-between border-t border-border/70 pt-3">
                <ThemeToggle size="sm" />
                <div className="truncate text-right text-xs text-muted-foreground">
                  <p className="truncate font-medium text-foreground">
                    {profile.name}
                  </p>
                  <p className="truncate">{profile.email}</p>
                </div>
              </div>
            </nav>
          </div>
        ) : null}
      </header>

      <section className="container-page py-8 md:py-10">{children}</section>
    </main>
  );
}
