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
  companyCommercialSchema,
  type CompanyCommercialInput,
} from "../schemas/company.schema";
import {
  completeCompanyOnboarding,
  updateCompanyCommercial,
} from "../services/company.service";
import { getCurrentAccessToken } from "../services/session-token.service";
import type { Company } from "../types/company";

type CompanyCommercialFormProps = {
  company: Company | null;
  submitLabel: string;
  completeOnSubmit?: boolean;
  onSaved?: (company: Company) => void;
  onCompleted?: () => void;
};

export function CompanyCommercialForm({
  company,
  submitLabel,
  completeOnSubmit = false,
  onSaved,
  onCompleted,
}: CompanyCommercialFormProps) {
  const form = useForm<CompanyCommercialInput>({
    resolver: zodResolver(companyCommercialSchema),
    defaultValues: {
      responsibleName: company?.responsibleName ?? "",
      responsibleRole: company?.responsibleRole ?? "",
      document: company?.document ?? "",
      address: company?.address ?? "",
      presentationText: company?.presentationText ?? "",
      footerText: company?.footerText ?? "",
      contactText: company?.contactText ?? "",
    },
  });

  async function onSubmit(values: CompanyCommercialInput) {
    try {
      const accessToken = await getCurrentAccessToken();
      const saved = await updateCompanyCommercial(accessToken, values);

      if (completeOnSubmit) {
        const completed = await completeCompanyOnboarding(accessToken);
        toast.success("Configuracao concluida.");
        if (completed.company) {
          onSaved?.(completed.company);
        }
        onCompleted?.();
        return;
      }

      toast.success("Dados comerciais salvos.");
      if (saved.company) {
        onSaved?.(saved.company);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel salvar os dados comerciais.",
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="responsibleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do responsavel</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder="Seu nome"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="responsibleRole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder="Ex: Fundador"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="document"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF ou CNPJ</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder="Opcional"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Endereco</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder="Opcional"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="presentationText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto padrao de apresentacao</FormLabel>
              <FormControl>
                <textarea
                  className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={form.formState.isSubmitting}
                  placeholder="Apresente sua empresa em propostas futuras."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="footerText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto padrao do rodape</FormLabel>
              <FormControl>
                <textarea
                  className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={form.formState.isSubmitting}
                  placeholder="Mensagem final, validade ou observacoes."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dados de contato</FormLabel>
              <FormControl>
                <textarea
                  className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={form.formState.isSubmitting}
                  placeholder="WhatsApp, e-mail, site ou canais comerciais."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
