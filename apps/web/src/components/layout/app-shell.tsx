import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { LogoutButton } from "@/components/layout/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
  const initials = profile.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <main className="min-h-screen bg-secondary/30">
      <header className="border-b bg-background">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Logo />
            <nav className="hidden items-center gap-2 md:flex">
              {navItems.map((item) => (
                <Button key={item.href} asChild variant="ghost" size="sm">
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 sm:flex">
              <Avatar>
                <AvatarImage
                  src={profile.avatarUrl ?? undefined}
                  alt={profile.name}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{profile.name}</p>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>
      <section className="container-page py-10">{children}</section>
    </main>
  );
}
