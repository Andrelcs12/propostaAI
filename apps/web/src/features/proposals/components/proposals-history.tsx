"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UsageMeter } from "@/features/billing/components/usage-meter";
import type { BillingUsage } from "@/features/billing/types/billing";
import { PROPOSAL_STATUS_LABELS } from "@/config/templates";
import type { ProposalSummary } from "@/features/proposals/types/proposal";

type ProposalsHistoryProps = {
  proposals: ProposalSummary[];
  usage: BillingUsage;
};

export function ProposalsHistory({
  proposals,
  usage,
}: ProposalsHistoryProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = useMemo(() => {
    return proposals.filter((proposal) => {
      const matchesQuery =
        query.trim().length === 0 ||
        proposal.title.toLowerCase().includes(query.toLowerCase()) ||
        proposal.clientName.toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || proposal.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [proposals, query, statusFilter]);

  const statusOptions = [
    "ALL",
    ...Array.from(new Set(proposals.map((proposal) => proposal.status))),
  ];

  return (
    <div className="space-y-6">
      <UsageMeter usage={usage} compact />

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Busque por cliente ou titulo e filtre por status.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar proposta ou cliente..."
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-48"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "ALL"
                    ? "Todos os status"
                    : (PROPOSAL_STATUS_LABELS[status] ?? status)}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>
              {proposals.length === 0
                ? "Nenhuma proposta ainda"
                : "Nenhum resultado"}
            </CardTitle>
            <CardDescription>
              {proposals.length === 0
                ? "Comece criando sua primeira proposta comercial."
                : "Ajuste os filtros para encontrar a proposta desejada."}
            </CardDescription>
          </CardHeader>
          {proposals.length === 0 ? (
            <CardContent>
              <Button asChild disabled={!usage.canCreateProposal}>
                <Link href="/propostas/nova">Criar primeira proposta</Link>
              </Button>
            </CardContent>
          ) : null}
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>{proposal.title}</CardTitle>
                  <CardDescription>{proposal.clientName}</CardDescription>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                  {PROPOSAL_STATUS_LABELS[proposal.status] ?? proposal.status}
                </span>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-muted-foreground">
                  <p>
                    Criada em{" "}
                    {new Date(proposal.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                  <p>
                    Atualizada em{" "}
                    {new Date(proposal.updatedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/propostas/${proposal.id}`}>Abrir</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
