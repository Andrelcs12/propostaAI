"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import {
  companyDefaultsSchema,
  type CompanyDefaultsInput,
} from "../schemas/company.schema";
import { updateCompanyDefaults } from "../services/company.service";
import { getCurrentAccessToken } from "../services/session-token.service";
import { PROPOSAL_TONE_OPTIONS, type Company } from "../types/company";

type CompanyDefaultsFormProps = {
  company: Company | null;
  submitLabel: string;
  onSaved?: (company: Company) => void;
};

const selectClassName =
  "h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export function CompanyDefaultsForm({
  company,
  submitLabel,
  onSaved,
}: CompanyDefaultsFormProps) {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="defaultValidityDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Validade padrao (dias)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={365}
                    disabled={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
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
                <FormMessage />
              </FormItem>
            )}
          />
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
                    <option value="MONTHLY">Mensal</option>
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
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="defaultTone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tom de comunicacao padrao</FormLabel>
              <FormControl>
                <select
                  className={selectClassName}
                  disabled={form.formState.isSubmitting}
                  {...field}
                >
                  {PROPOSAL_TONE_OPTIONS.map((tone) => (
                    <option key={tone.value} value={tone.value}>
                      {tone.label}
                    </option>
                  ))}
                </select>
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
              <FormItem className="flex items-center gap-3 rounded-md border px-4 py-3">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    disabled={form.formState.isSubmitting}
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Mostrar valores detalhados</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="showDiscount"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 rounded-md border px-4 py-3">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    disabled={form.formState.isSubmitting}
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                </FormControl>
                <FormLabel className="!mt-0">Mostrar desconto</FormLabel>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : null}
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}
