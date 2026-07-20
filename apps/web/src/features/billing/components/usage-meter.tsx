"use client";

import { AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { UpgradeCard } from "./upgrade-card";
import type { BillingUsage } from "../types/billing";

type UsageMeterProps = {
  usage: BillingUsage;
  compact?: boolean;
  className?: string;
};

export function UsageMeter({ usage, compact, className }: UsageMeterProps) {
  const isPro = usage.plan === "pro";
  const limit = usage.proposalsLimit ?? 0;
  const percent =
    limit > 0 ? Math.min(100, Math.round((usage.proposalsUsed / limit) * 100)) : 0;
  const atLimit = !usage.canCreateProposal && !isPro;

  if (isPro) {
    return (
      <div className={cn("rounded-xl border bg-card p-4", className)}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Plano Pro</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {usage.subscriptionStatus === "active"
                ? "Assinatura ativa"
                : usage.subscriptionStatus ?? "Assinatura ativa"}
            </p>
            {usage.currentPeriodEnd ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Próxima renovação:{" "}
                {new Date(usage.currentPeriodEnd).toLocaleDateString("pt-BR")}
              </p>
            ) : null}
            {usage.cancelAtPeriodEnd && usage.currentPeriodEnd ? (
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                Cancelamento agendado. Acesso até{" "}
                {new Date(usage.currentPeriodEnd).toLocaleDateString("pt-BR")}.
              </p>
            ) : null}
          </div>
          <div className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            Pro
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4",
        atLimit && "border-amber-500/40 bg-amber-500/5",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Propostas gratuitas</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">
            {usage.proposalsUsed}
            <span className="text-base font-normal text-muted-foreground">
              {" "}
              / {limit} utilizadas
            </span>
          </p>
          {!compact ? (
            <p className="mt-1 text-sm text-muted-foreground">
              {atLimit
                ? "Limite atingido."
                : `${usage.proposalsRemaining ?? 0} restante${(usage.proposalsRemaining ?? 0) === 1 ? "" : "s"}.`}
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
            usage.aiConfigured
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground",
          )}
        >
          <Sparkles className="size-3.5" />
          {usage.aiConfigured ? "IA ativa" : "IA nao configurada"}
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            atLimit ? "bg-amber-500" : "bg-primary",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>

      {atLimit ? (
        <div className="mt-4 space-y-3 rounded-lg border border-amber-500/30 bg-background/60 px-3 py-3">
          <div className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
            <AlertTriangle className="size-4 shrink-0" />
            <span>Limite atingido. Assine o plano Pro para continuar.</span>
          </div>
          <UpgradeCard compact />
        </div>
      ) : null}
    </div>
  );
}
