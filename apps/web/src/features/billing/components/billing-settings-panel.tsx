"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCurrentAccessToken } from "@/features/company/services/session-token.service";
import { UpgradeCard } from "@/features/billing/components/upgrade-card";
import { UsageMeter } from "@/features/billing/components/usage-meter";
import {
  createPortalSession,
  getBillingUsage,
} from "@/features/billing/services/billing.service";
import type { BillingUsage } from "@/features/billing/types/billing";

export function BillingSettingsPanel() {
  const [usage, setUsage] = useState<BillingUsage | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const accessToken = await getCurrentAccessToken();
        setUsage(await getBillingUsage(accessToken));
      } catch {
        // ignore
      }
    })();
  }, []);

  async function handlePortal() {
    try {
      setLoadingPortal(true);
      const accessToken = await getCurrentAccessToken();
      const { url } = await createPortalSession(accessToken);
      window.location.href = url;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel abrir o portal.",
      );
    } finally {
      setLoadingPortal(false);
    }
  }

  if (!usage) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <UsageMeter usage={usage} />
      {usage.plan === "pro" ? (
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar assinatura</CardTitle>
            <CardDescription>
              Cartão, faturas e cancelamento pelo Stripe Customer Portal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handlePortal} disabled={loadingPortal}>
              {loadingPortal ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : null}
              Gerenciar assinatura
            </Button>
          </CardContent>
        </Card>
      ) : (
        <UpgradeCard />
      )}
    </div>
  );
}
