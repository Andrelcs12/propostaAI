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
  companyIdentitySchema,
  type CompanyIdentityInput,
} from "../schemas/company.schema";
import { updateCompanyIdentity } from "../services/company.service";
import { getCurrentAccessToken } from "../services/session-token.service";
import type { Company } from "../types/company";

type CompanyIdentityFormProps = {
  company: Company | null;
  submitLabel: string;
  onSaved?: (company: Company) => void;
};

export function CompanyIdentityForm({
  company,
  submitLabel,
  onSaved,
}: CompanyIdentityFormProps) {
  const isIndividual = company?.profileType === "INDIVIDUAL";

  const form = useForm<CompanyIdentityInput>({
    resolver: zodResolver(companyIdentitySchema),
    defaultValues: {
      tradeName: company?.tradeName ?? "",
      presentationText: company?.presentationText ?? "",
      responsibleName: company?.responsibleName ?? "",
      responsibleRole: company?.responsibleRole ?? "",
      contactText: company?.contactText ?? "",
      showContactData: company?.showContactData ?? true,
      showSignature: company?.showSignature ?? true,
    },
  });

  async function onSubmit(values: CompanyIdentityInput) {
    try {
      const accessToken = await getCurrentAccessToken();
      const result = await updateCompanyIdentity(accessToken, values);
      toast.success("Identidade comercial salva.");
      if (result.company) {
        onSaved?.(result.company);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel salvar a identidade.",
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="tradeName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {isIndividual
                  ? "Nome que aparecera nas propostas"
                  : "Nome comercial nas propostas"}
              </FormLabel>
              <FormControl>
                <Input
                  disabled={form.formState.isSubmitting}
                  placeholder={
                    isIndividual ? "Ex: Lucas Design" : "Ex: Studio Lucas"
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="presentationText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto curto de apresentacao</FormLabel>
              <FormControl>
                <textarea
                  className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={form.formState.isSubmitting}
                  placeholder="Apresente-se em poucas linhas."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="responsibleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {isIndividual ? "Seu nome completo" : "Nome do responsavel"}
                </FormLabel>
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
                <FormLabel>
                  {isIndividual ? "Titulo profissional" : "Cargo ou assinatura"}
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder={
                      isIndividual ? "Ex: Designer UX" : "Ex: Diretor comercial"
                    }
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
          name="contactText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dados de contato no documento</FormLabel>
              <FormControl>
                <textarea
                  className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={form.formState.isSubmitting}
                  placeholder="WhatsApp, e-mail, site ou redes."
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
            name="showContactData"
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
                <FormLabel className="!mt-0">Mostrar dados de contato</FormLabel>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="showSignature"
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
                <FormLabel className="!mt-0">Mostrar assinatura</FormLabel>
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
