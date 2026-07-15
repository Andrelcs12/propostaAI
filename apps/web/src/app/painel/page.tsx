import { ArrowLeft, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { LogoutButton } from "@/components/layout/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentProfile } from "@/features/auth/services/profile.service";
import { getBillingConfig } from "@/features/billing/services/billing.service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    redirect("/login");
  }

  const [profile, billingConfig] = await Promise.all([
    getCurrentProfile(session.access_token),
    getBillingConfig(session.access_token)
  ]);

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
                <AvatarImage src={profile.avatarUrl ?? undefined} alt={profile.name} />
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
        <Button asChild variant="ghost" className="mb-6 px-0">
          <Link href="/">
            <ArrowLeft />
            Voltar para landing
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-normal">Bem-vindo, {profile.name}</h1>
          <p className="mt-2 text-muted-foreground">{profile.email}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <ShieldCheck className="size-5 text-primary" />
              <CardTitle>Template pronto</CardTitle>
              <CardDescription>
                Autenticacao, rota protegida, API e usuario persistido estao conectados.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Esta tela existe apenas para comprovar o fluxo autenticado.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CreditCard className="size-5 text-primary" />
              <CardTitle>Stripe estrutural</CardTitle>
              <CardDescription>Stripe preparado para implementação futura.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Status: {billingConfig.enabled ? "ativo" : "inativo"} - {billingConfig.mode}
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
