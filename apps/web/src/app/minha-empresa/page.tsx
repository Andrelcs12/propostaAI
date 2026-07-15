import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { LogoutButton } from "@/components/layout/logout-button";
import { Button } from "@/components/ui/button";
import { CompanySettings } from "@/features/company/components/company-settings";
import { requireOnboardingStatus } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function MinhaEmpresaPage() {
  const { companyStatus } = await requireOnboardingStatus();

  if (!companyStatus.onboardingDone) {
    redirect("/onboarding");
  }

  if (!companyStatus.company) {
    redirect("/onboarding");
  }

  return (
    <main className="min-h-screen bg-secondary/30">
      <header className="border-b bg-background">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/painel">Painel</Link>
            </Button>
            <LogoutButton />
          </div>
        </div>
      </header>
      <section className="container-page py-10">
        <CompanySettings initialCompany={companyStatus.company} />
      </section>
    </main>
  );
}
