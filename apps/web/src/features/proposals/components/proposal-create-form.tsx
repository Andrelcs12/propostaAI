"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Company, ProposalTone } from "@/features/company/types/company";
import { getCurrentAccessToken } from "@/features/company/services/session-token.service";
import {
  DynamicListField,
  SimpleListItemEditor,
} from "./dynamic-list-field";
import { ToneSelector } from "./tone-selector";
import {
  createEmptyInvestmentItem,
  createEmptyListItem,
  createEmptyTimelineItem,
  createProposalSchema,
  type CreateProposalInput,
} from "../schemas/proposal.schema";
import { createProposal } from "../services/proposal.service";

type ProposalCreateFormProps = {
  company: Company;
};

export function ProposalCreateForm({ company }: ProposalCreateFormProps) {
  const router = useRouter();
  const [tone, setTone] = useState<ProposalTone>(company.defaultTone);

  const defaultValidity = new Date();
  defaultValidity.setDate(
    defaultValidity.getDate() + company.defaultValidityDays,
  );

  const form = useForm<CreateProposalInput>({
    resolver: zodResolver(createProposalSchema),
    defaultValues: {
      clientName: "",
      clientContactName: "",
      clientEmail: "",
      clientPhone: "",
      clientSegment: "",
      clientWebsite: "",
      clientDescription: "",
      clientProblem: "",
      title: "",
      serviceOffered: "",
      objective: "",
      scope: [createEmptyListItem()],
      deliverables: [createEmptyListItem()],
      timeline: [createEmptyTimelineItem(0)],
      investment: [createEmptyInvestmentItem(0)],
      paymentConditions: company.defaultPaymentConditions ?? "",
      validityDate: defaultValidity.toISOString().slice(0, 10),
      observations: "",
      differentials: [],
      nextSteps: "",
      terms: company.defaultTerms ?? "",
      tone: company.defaultTone,
    },
  });

  async function onSubmit(values: CreateProposalInput) {
    try {
      const accessToken = await getCurrentAccessToken();
      const proposal = await createProposal(accessToken, {
        ...values,
        tone,
        scope: values.scope.filter((item) => item.title.trim()),
        deliverables: values.deliverables.filter((item) => item.title.trim()),
        timeline: values.timeline.filter((item) => item.title.trim()),
        investment: values.investment.filter((item) => item.label.trim()),
        differentials: values.differentials.filter((item) => item.trim()),
      });
      toast.success("Proposta criada.");
      router.push(`/propostas/${proposal.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel criar a proposta.",
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Informacoes do cliente</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField form={form} name="clientName" label="Nome do cliente" />
            <TextField
              form={form}
              name="clientContactName"
              label="Nome do responsavel"
            />
            <TextField form={form} name="clientEmail" label="E-mail" />
            <TextField form={form} name="clientPhone" label="Telefone" />
            <TextField form={form} name="clientSegment" label="Segmento" />
            <TextField form={form} name="clientWebsite" label="Site ou rede social" />
          </div>
          <TextAreaField
            form={form}
            name="clientDescription"
            label="Descricao do cliente ou contexto"
          />
          <TextAreaField
            form={form}
            name="clientProblem"
            label="Principal problema ou necessidade"
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Informacoes da proposta</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <TextField form={form} name="title" label="Titulo da proposta" />
            <TextField
              form={form}
              name="serviceOffered"
              label="Servico ou solucao oferecida"
            />
            <TextField form={form} name="validityDate" label="Validade" type="date" />
          </div>
          <TextAreaField form={form} name="objective" label="Objetivo" />
          <TextAreaField
            form={form}
            name="paymentConditions"
            label="Condicoes de pagamento"
          />
          <TextAreaField form={form} name="observations" label="Observacoes" />
          <TextAreaField form={form} name="nextSteps" label="Proximos passos" />
          <TextAreaField form={form} name="terms" label="Termos" />
        </section>

        <DynamicListField
          label="Escopo"
          items={form.watch("scope")}
          disabled={form.formState.isSubmitting}
          onChange={(items) => form.setValue("scope", items)}
          createItem={createEmptyListItem}
          renderItem={(item, _index, update) => (
            <SimpleListItemEditor
              title={item.title}
              description={item.description ?? ""}
              disabled={form.formState.isSubmitting}
              onChange={(values) => update({ ...item, ...values })}
            />
          )}
        />

        <DynamicListField
          label="Entregaveis"
          items={form.watch("deliverables")}
          disabled={form.formState.isSubmitting}
          onChange={(items) => form.setValue("deliverables", items)}
          createItem={createEmptyListItem}
          renderItem={(item, _index, update) => (
            <SimpleListItemEditor
              title={item.title}
              description={item.description ?? ""}
              disabled={form.formState.isSubmitting}
              onChange={(values) => update({ ...item, ...values })}
            />
          )}
        />

        <DynamicListField
          label="Etapas / cronograma"
          items={form.watch("timeline")}
          disabled={form.formState.isSubmitting}
          onChange={(items) => form.setValue("timeline", items)}
          createItem={() =>
            createEmptyTimelineItem(form.watch("timeline").length)
          }
          renderItem={(item, _index, update) => (
            <div className="grid gap-3">
              <Input
                disabled={form.formState.isSubmitting}
                placeholder="Etapa"
                value={item.title}
                onChange={(event) =>
                  update({ ...item, title: event.target.value })
                }
              />
              <Input
                disabled={form.formState.isSubmitting}
                placeholder="Duracao"
                value={item.duration ?? ""}
                onChange={(event) =>
                  update({ ...item, duration: event.target.value })
                }
              />
              <textarea
                className="min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm"
                disabled={form.formState.isSubmitting}
                placeholder="Descricao"
                value={item.description ?? ""}
                onChange={(event) =>
                  update({ ...item, description: event.target.value })
                }
              />
            </div>
          )}
        />

        <DynamicListField
          label="Valores"
          items={form.watch("investment")}
          disabled={form.formState.isSubmitting}
          onChange={(items) => form.setValue("investment", items)}
          createItem={() =>
            createEmptyInvestmentItem(form.watch("investment").length)
          }
          renderItem={(item, _index, update) => (
            <div className="grid gap-3 md:grid-cols-[1fr_160px]">
              <Input
                disabled={form.formState.isSubmitting}
                placeholder="Descricao do valor"
                value={item.label}
                onChange={(event) =>
                  update({ ...item, label: event.target.value })
                }
              />
              <Input
                type="number"
                min={0}
                disabled={form.formState.isSubmitting}
                placeholder="Valor"
                value={item.amount}
                onChange={(event) =>
                  update({ ...item, amount: Number(event.target.value) || 0 })
                }
              />
            </div>
          )}
        />

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Tom da proposta</h2>
          <ToneSelector
            value={tone}
            disabled={form.formState.isSubmitting}
            onChange={setTone}
          />
        </section>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : null}
          Criar proposta
        </Button>
      </form>
    </Form>
  );
}

function TextField({
  form,
  name,
  label,
  type = "text",
}: {
  form: ReturnType<typeof useForm<CreateProposalInput>>;
  name: Extract<keyof CreateProposalInput, string>;
  label: string;
  type?: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              {...field}
              value={typeof field.value === "string" ? field.value : ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function TextAreaField({
  form,
  name,
  label,
}: {
  form: ReturnType<typeof useForm<CreateProposalInput>>;
  name: Extract<keyof CreateProposalInput, string>;
  label: string;
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <textarea
              className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...field}
              value={typeof field.value === "string" ? field.value : ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
