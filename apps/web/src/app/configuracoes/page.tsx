import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/features/auth/services/profile.service";
import { SettingsTabs } from "@/features/company/components/settings-tabs";
import { requireOnboardingStatus } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { accessToken, companyStatus } = await requireOnboardingStatus();

  if (!companyStatus.onboardingDone || !companyStatus.company) {
    redirect("/onboarding");
  }

  const profile = await getCurrentProfile(accessToken);

  return (
    <AppShell profile={profile}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">Configuracoes</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal">
            Preferencias da conta
          </h1>
          <p className="mt-2 text-muted-foreground">
            Perfil, identidade visual, padroes comerciais e formato do PDF.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/painel">Voltar ao painel</Link>
        </Button>
      </div>
      <SettingsTabs
        initialCompany={companyStatus.company}
        profile={{ email: profile.email, name: profile.name }}
      />
    </AppShell>
  );
}
