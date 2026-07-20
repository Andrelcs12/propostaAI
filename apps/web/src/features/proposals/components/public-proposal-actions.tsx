"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ProposalStatus } from "../types/proposal";

type PublicProposalActionsProps = {
  token: string;
  status: ProposalStatus;
  onUpdated: (status: ProposalStatus) => void;
};

export function PublicProposalActions({
  token,
  status,
  onUpdated,
}: PublicProposalActionsProps) {
  const [mode, setMode] = useState<"none" | "accept" | "reject">("none");
  const [loading, setLoading] = useState(false);
  const [acceptedByName, setAcceptedByName] = useState("");
  const [acceptedByEmail, setAcceptedByEmail] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const decided = status === "ACCEPTED" || status === "REJECTED";

  async function submitAccept() {
    if (!acceptedByName.trim()) {
      toast.error("Informe seu nome para confirmar.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/proposals/public/${token}/accept`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            acceptedByName,
            acceptedByEmail: acceptedByEmail || undefined,
          }),
        },
      );
      const body = (await response.json()) as {
        message?: string;
        status?: ProposalStatus;
      };
      if (!response.ok) throw new Error(body.message ?? "Erro ao aceitar.");
      if (!body.status) throw new Error("Resposta invalida.");
      onUpdated(body.status);
      setMode("none");
      toast.success("Proposta aceita com sucesso.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao aceitar.");
    } finally {
      setLoading(false);
    }
  }

  async function submitReject() {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/proposals/public/${token}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rejectionReason: rejectionReason || undefined,
          }),
        },
      );
      const body = (await response.json()) as {
        message?: string;
        status?: ProposalStatus;
      };
      if (!response.ok) throw new Error(body.message ?? "Erro ao recusar.");
      if (!body.status) throw new Error("Resposta invalida.");
      onUpdated(body.status);
      setMode("none");
      toast.message("Proposta recusada.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao recusar.");
    } finally {
      setLoading(false);
    }
  }

  if (decided) {
    return (
      <div className="mb-6 rounded-xl border bg-background/90 px-4 py-4 text-sm">
        {status === "ACCEPTED" ? (
          <p className="font-medium text-primary">
            Proposta aceita. Obrigado pela confirmação.
          </p>
        ) : (
          <p className="font-medium text-muted-foreground">Proposta recusada.</p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-6 space-y-3">
      {mode === "none" ? (
        <div className="flex flex-wrap gap-3 rounded-xl border bg-background/90 px-4 py-4">
          <Button onClick={() => setMode("accept")}>Aceitar proposta</Button>
          <Button variant="outline" onClick={() => setMode("reject")}>
            Recusar proposta
          </Button>
        </div>
      ) : null}

      {mode === "accept" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Confirmar aceite</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="acceptedByName">Seu nome</Label>
              <Input
                id="acceptedByName"
                value={acceptedByName}
                onChange={(e) => setAcceptedByName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="acceptedByEmail">E-mail (opcional)</Label>
              <Input
                id="acceptedByEmail"
                type="email"
                value={acceptedByEmail}
                onChange={(e) => setAcceptedByEmail(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={submitAccept} disabled={loading}>
                {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                Confirmar aceite
              </Button>
              <Button variant="ghost" onClick={() => setMode("none")}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {mode === "reject" ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recusar proposta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Motivo (opcional)"
            />
            <div className="flex gap-2">
              <Button variant="destructive" onClick={submitReject} disabled={loading}>
                {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                Confirmar recusa
              </Button>
              <Button variant="ghost" onClick={() => setMode("none")}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
