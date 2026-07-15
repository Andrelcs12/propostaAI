import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { LogoutButton } from "@/components/layout/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentProfile } from "@/features/auth/services/profile.service";
import { requireOnboardingStatus } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { accessToken, companyStatus } = await requireOnboardingStatus();

  if (!companyStatus.onboardingDone) {
    redirect("/onboarding");
  }

  if (!companyStatus.company) {
    redirect("/onboarding");
  }

  const profile = await getCurrentProfile(accessToken);
  const company = companyStatus.company;
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
          <Logo />
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

      <section className="container-page py-10">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">Painel</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">
            Configuracao concluida
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sua empresa esta pronta para criar propostas comerciais.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CheckCircle2 className="size-5 text-primary" />
              <CardTitle>{company.name}</CardTitle>
              <CardDescription>
                Onboarding concluido. A proxima etapa sera construir o dashboard
                completo e a primeira proposta.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/minha-empresa">Ver minha empresa</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Brand Kit</CardTitle>
              <CardDescription>Cores principais configuradas.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              {[
                ["Principal", company.primaryColor],
                ["Secundaria", company.secondaryColor],
                ["Destaque", company.accentColor],
              ].map(([label, color]) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-md border bg-card px-3 py-2"
                >
                  <span className="text-muted-foreground">{label}</span>
                  <span className="inline-flex items-center gap-2 font-medium">
                    <span
                      className="size-4 rounded-full border"
                      style={{ backgroundColor: color }}
                    />
                    {color}
                  </span>
                </div>
              ))}
              <div className="rounded-md border bg-card px-3 py-2">
                <span className="text-muted-foreground">Status:</span>{" "}
                <span className="font-medium">Onboarding concluido</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
