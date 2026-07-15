import type { Metadata } from "next";
import { LandingPage } from "@/components/landing/landing-page";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proposta AI — Crie propostas comerciais profissionais",
  description:
    "Configure sua empresa, personalize sua identidade visual e crie propostas comerciais claras para vender serviços B2B.",
  openGraph: {
    title: "Proposta AI — Crie propostas comerciais profissionais",
    description:
      "Configure sua empresa, personalize sua identidade visual e crie propostas comerciais claras para vender serviços B2B.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Proposta AI — Crie propostas comerciais profissionais",
    description:
      "Configure sua empresa, personalize sua identidade visual e crie propostas comerciais claras para vender serviços B2B.",
  },
};

export default async function Page() {
  const isAuthenticated = await getIsAuthenticated();

  return <LandingPage isAuthenticated={isAuthenticated} />;
}

async function getIsAuthenticated() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return Boolean(user);
  } catch {
    return false;
  }
}
