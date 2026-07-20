"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, ChevronDown, Loader2, MessageSquare, Wallet } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { COMMERCIAL_PROPOSAL_SECTIONS } from "@/config/proposal-model";
import { ToneSelector } from "@/features/proposals/components/tone-selector";
import {
  companyDefaultsSchema,
  type CompanyDefaultsInput,
} from "../schemas/company.schema";
import { BrandPreview } from "./brand-preview";
import { updateCompanyDefaults } from "../services/company.service";
import { getCurrentAccessToken } from "../services/session-token.service";
import type { Company } from "../types/company";

type CompanyDefaultsFormProps = {
  company: Company | null;
  submitLabel: string;
  embedded?: boolean;
  onSaved?: (company: Company) => void;
};

const selectClassName =
  "h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

function DefaultsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border-b border-border/60 pb-6 last:border-b-0 last:pb-0">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" />
        </div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function CompanyDefaultsForm({
  company,
  submitLabel,
  embedded,
  onSaved,
}: CompanyDefaultsFormProps) {
  const [showOptionalTexts, setShowOptionalTexts] = useState(false);

  const form = useForm<CompanyDefaultsInput>({
    resolver: zodResolver(companyDefaultsSchema),
    defaultValues: {
      defaultValidityDays: company?.defaultValidityDays ?? 15,
      defaultDeliveryTime: company?.defaultDeliveryTime ?? "",
      defaultPaymentConditions: company?.defaultPaymentConditions ?? "",
      defaultCurrency: company?.defaultCurrency ?? "BRL",
      defaultBillingType: company?.defaultBillingType ?? "PROJECT",
      defaultIntroMessage: company?.defaultIntroMessage ?? "",
      defaultClosingMessage: company?.defaultClosingMessage ?? "",
      defaultTerms: company?.defaultTerms ?? "",
      showDetailedValues: company?.showDetailedValues ?? true,
      showDiscount: company?.showDiscount ?? false,
      defaultTone: company?.defaultTone ?? "PROFESSIONAL",
    },
  });

  async function onSubmit(values: CompanyDefaultsInput) {
    try {
      const accessToken = await getCurrentAccessToken();
      const result = await updateCompanyDefaults(accessToken, values);
      toast.success("Padroes das propostas salvos.");
      if (result.company) {
        onSaved?.(result.company);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel salvar os padroes.",
      );
    }
  }

  return (
    <div className={embedded ? "grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]" : ""}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {!embedded ? (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
              Esses padroes preenchem automaticamente novas propostas. A IA usa
              essas informacoes como base para gerar o documento comercial
              completo.
            </div>
          ) : null}

          <DefaultsSection
            icon={CalendarClock}
            title="Prazos e validade"
            description="Defina por quanto tempo a proposta vale e qual prazo padrao de entrega voce costuma trabalhar."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="defaultValidityDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validade da proposta (dias)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={365}
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Apos esse prazo, valores e condicoes podem ser revisados.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultDeliveryTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo estimado de entrega</FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="Ex: 30 dias uteis"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Aparece no cronograma quando voce nao informar outro prazo.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </DefaultsSection>

          <DefaultsSection
            icon={Wallet}
            title="Investimento e cobranca"
            description="Como voce costuma precificar e cobrar seus projetos."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="defaultCurrency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moeda</FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        maxLength={3}
                        placeholder="BRL"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="defaultBillingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de cobranca</FormLabel>
                    <FormControl>
                      <select
                        className={selectClassName}
                        disabled={form.formState.isSubmitting}
                        {...field}
                      >
                        <option value="PROJECT">Por projeto</option>
                        <option value="FIXED">Valor fixo</option>
                        <option value="HOURLY">Por hora</option>
                        <option value="MONTHLY">Mensal (recorrente)</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="defaultPaymentConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condicoes de pagamento</FormLabel>
                  <FormControl>
                    <textarea
                      className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      disabled={form.formState.isSubmitting}
                      placeholder="Ex: 50% na aprovacao e 50% na entrega."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="showDetailedValues"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3 rounded-xl border px-4 py-3">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={field.value}
                        disabled={form.formState.isSubmitting}
                        onChange={(event) => field.onChange(event.target.checked)}
                      />
                    </FormControl>
                    <div>
                      <FormLabel className="!mt-0">Detalhar valores</FormLabel>
                      <FormDescription>
                        Exibe itens e valores separados na proposta.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showDiscount"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3 rounded-xl border px-4 py-3">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={field.value}
                        disabled={form.formState.isSubmitting}
                        onChange={(event) => field.onChange(event.target.checked)}
                      />
                    </FormControl>
                    <div>
                      <FormLabel className="!mt-0">Mostrar desconto</FormLabel>
                      <FormDescription>
                        Reserva espaco para condicao comercial especial.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </DefaultsSection>

          <DefaultsSection
            icon={MessageSquare}
            title="Tom da comunicacao"
            description="Define como a IA escreve por padrao. Voce pode mudar em cada proposta."
          >
            <FormField
              control={form.control}
              name="defaultTone"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ToneSelector
                      value={field.value}
                      disabled={form.formState.isSubmitting}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </DefaultsSection>

          <section className="rounded-xl border">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
              onClick={() => setShowOptionalTexts((current) => !current)}
            >
              <div>
                <p className="font-medium">Textos base (opcional)</p>
                <p className="text-sm text-muted-foreground">
                  Introducao, encerramento e termos reutilizados pela IA.
                </p>
              </div>
              <ChevronDown
                className={`size-4 shrink-0 transition-transform ${showOptionalTexts ? "rotate-180" : ""}`}
              />
            </button>

            {showOptionalTexts ? (
              <div className="space-y-4 border-t px-4 py-4">
                <FormField
                  control={form.control}
                  name="defaultIntroMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem inicial padrao</FormLabel>
                      <FormControl>
                        <textarea
                          className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          disabled={form.formState.isSubmitting}
                          placeholder="Ex: Obrigado pela oportunidade. Segue nossa proposta para..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultClosingMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mensagem final padrao</FormLabel>
                      <FormControl>
                        <textarea
                          className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          disabled={form.formState.isSubmitting}
                          placeholder="Ex: Fico a disposicao para ajustes e proximos passos."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="defaultTerms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Termos e observacoes</FormLabel>
                      <FormControl>
                        <textarea
                          className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          disabled={form.formState.isSubmitting}
                          placeholder="Ex: Alteracoes fora do escopo serao orcadas separadamente."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : null}
          </section>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : null}
            {submitLabel}
          </Button>
        </form>
      </Form>

      {embedded ? (
        <aside className="hidden xl:block">
          <div className="sticky top-6 space-y-4">
            <div className="rounded-xl border bg-muted/20 p-4">
              <p className="text-sm font-medium">Estrutura da proposta</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                A IA monta o documento comercial seguindo este modelo:
              </p>
              <ol className="mt-3 max-h-48 space-y-1.5 overflow-y-auto text-xs text-muted-foreground">
                {COMMERCIAL_PROPOSAL_SECTIONS.filter(
                  (section) => section.id !== "header",
                ).map((section, index) => (
                  <li key={section.id} className="flex gap-2">
                    <span className="font-semibold text-primary">
                      {index + 1}.
                    </span>
                    <span>{section.title}</span>
                  </li>
                ))}
              </ol>
            </div>

            {company ? (
              <BrandPreview
                company={company}
                brand={{
                  logoUrl: company.logoUrl ?? "",
                  lightLogoUrl: company.lightLogoUrl ?? "",
                  primaryColor: company.primaryColor,
                  secondaryColor: company.secondaryColor,
                  accentColor: company.accentColor,
                  backgroundColor: company.backgroundColor,
                  surfaceColor: company.surfaceColor,
                  textColor: company.textColor,
                  visualPreference: company.visualPreference,
                  fontPreference: company.fontPreference,
                  visualStyle: company.visualStyle,
                  borderRadius: company.borderRadius,
                }}
                compact
              />
            ) : null}
          </div>
        </aside>
      ) : null}
    </div>
  );
}
