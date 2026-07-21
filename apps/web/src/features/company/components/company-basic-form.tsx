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
import { resolveBusinessSegment } from "@novely/shared";
import { Input } from "@/components/ui/input";
import { SegmentSelectField } from "./segment-select-field";
import {
  companyBasicSchema,
  type CompanyBasicInput,
} from "../schemas/company.schema";
import { getCurrentAccessToken } from "../services/session-token.service";
import { updateCompanyBasic } from "../services/company.service";
import type { Company } from "../types/company";

type CompanyBasicFormProps = {
  company: Company | null;
  submitLabel: string;
  onSaved?: (company: Company) => void;
};

export function CompanyBasicForm({
  company,
  submitLabel,
  onSaved,
}: CompanyBasicFormProps) {
  const isIndividual = company?.profileType === "INDIVIDUAL";
  const labels = isIndividual
    ? {
        name: "Nome profissional",
        namePlaceholder: "Ex: Lucas Design",
        tradeName: "Nome completo",
        tradeNamePlaceholder: "Ex: Lucas Almeida",
        segment: "Area de atuacao",
        segmentPlaceholder: "Selecione um segmento",
        email: "E-mail profissional",
        emailPlaceholder: "contato@seudominio.com",
        website: "Site ou portfolio",
        description: "Descricao curta dos servicos",
        descriptionPlaceholder: "Explique em poucas linhas o que voce oferece.",
      }
    : {
        name: "Nome da empresa",
        namePlaceholder: "Ex: Studio Lucas",
        tradeName: "Nome comercial",
        tradeNamePlaceholder: "Ex: Proposta AI",
        segment: "Segmento de atuacao",
        segmentPlaceholder: "Selecione um segmento",
        email: "E-mail comercial",
        emailPlaceholder: "comercial@suaempresa.com",
        website: "Site",
        description: "Descricao curta da empresa",
        descriptionPlaceholder: "Explique em poucas linhas o que sua empresa faz.",
      };

  const form = useForm<CompanyBasicInput>({
    resolver: zodResolver(companyBasicSchema),
    defaultValues: {
      name: company?.name ?? "",
      tradeName: company?.tradeName ?? "",
      description: company?.description ?? "",
      segment: resolveBusinessSegment(company?.segment ?? ""),
      website: company?.website ?? "",
      commercialEmail: company?.commercialEmail ?? "",
      whatsapp: company?.whatsapp ?? "",
      instagram: company?.instagram ?? "",
      city: company?.city ?? "",
      state: company?.state ?? "",
    },
  });

  async function onSubmit(values: CompanyBasicInput) {
    try {
      const accessToken = await getCurrentAccessToken();
      const result = await updateCompanyBasic(accessToken, values);
      toast.success("Dados da empresa salvos.");

      if (result.company) {
        onSaved?.(result.company);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel salvar os dados.",
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.name}</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder={labels.namePlaceholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tradeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.tradeName}</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder={labels.tradeNamePlaceholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SegmentSelectField
            control={form.control}
            name="segment"
            label={labels.segment}
            disabled={form.formState.isSubmitting}
            required
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.website}</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder="https://suaempresa.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="commercialEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{labels.email}</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder={labels.emailPlaceholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="whatsapp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>WhatsApp</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder="(85) 99999-9999"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instagram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder="@suaempresa"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-[1fr_96px] gap-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder="Fortaleza"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UF</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder="CE"
                      maxLength={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{labels.description}</FormLabel>
              <FormControl>
                <textarea
                  className="min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={form.formState.isSubmitting}
                  placeholder={labels.descriptionPlaceholder}
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
