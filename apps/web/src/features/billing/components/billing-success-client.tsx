"use client";

import { CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentAccessToken } from "@/features/company/services/session-token.service";
import { getBillingStatus } from "@/features/billing/services/billing.service";
import type { BillingStatus } from "@/features/billing/types/billing";

type BillingSuccessClientProps = {
  profile: {
    name: string;
    email: string;
    avatarUrl?: string | null;
  };
};

export function BillingSuccessClient({ profile }: BillingSuccessClientProps) {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshStatus() {
    try {
      setLoading(true);
      const accessToken = await getCurrentAccessToken();
      setStatus(await getBillingStatus(accessToken));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refreshStatus();
    const timer = window.setInterval(() => {
      void refreshStatus();
    }, 4000);
    return () => window.clearInterval(timer);
  }, []);

  const confirmed = status?.plan === "PRO";

  return (
    <AppShell profile={profile}>
      <Card className="mx-auto max-w-lg">
        <CardHeader className="text-center">
          <CardTitle>
            {confirmed ? "Assinatura confirmada" : "Confirmando assinatura"}
          </CardTitle>
          <CardDescription>
            {confirmed
              ? "Seu plano Pro está ativo. Você já pode criar novas propostas."
              : "Aguardando confirmação do pagamento via webhook do Stripe."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {loading ? (
            <Loader2 className="mx-auto size-8 animate-spin text-primary" />
          ) : confirmed ? (
            <CheckCircle2 className="mx-auto size-10 text-primary" />
          ) : (
            <p className="text-sm text-muted-foreground">
              Isso pode levar alguns segundos. Se demorar, atualize o status
              abaixo.
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild disabled={!confirmed}>
              <Link href="/propostas/nova">Criar nova proposta</Link>
            </Button>
            <Button variant="outline" onClick={refreshStatus}>
              <RefreshCw className="mr-2 size-4" />
              Atualizar status
            </Button>
            <Button asChild variant="ghost">
              <Link href="/configuracoes">Ir para configurações</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
