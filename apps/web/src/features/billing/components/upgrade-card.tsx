"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
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
import { createCheckoutSession } from "../services/billing.service";

type UpgradeCardProps = {
  compact?: boolean;
};

export function UpgradeCard({ compact }: UpgradeCardProps) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    try {
      setLoading(true);
      const accessToken = await getCurrentAccessToken();
      const { url } = await createCheckoutSession(accessToken);
      window.location.href = url;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel iniciar o checkout.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (compact) {
    return (
      <Button onClick={handleCheckout} disabled={loading}>
        {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
        Assinar plano Pro
      </Button>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Plano Pro</CardTitle>
        <CardDescription>R$ 49/mês · renovação automática</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>Propostas sem limite gratuito</li>
          <li>Pesquisa inteligente de empresas</li>
          <li>Geração com IA e referências</li>
          <li>PDF profissional e link público</li>
          <li>Aceite online pelo cliente</li>
        </ul>
        <Button className="w-full" onClick={handleCheckout} disabled={loading}>
          {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          Assinar plano Pro
        </Button>
      </CardContent>
    </Card>
  );
}
