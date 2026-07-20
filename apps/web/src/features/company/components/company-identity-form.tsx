"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Loader2, MapPin, UserRound } from "lucide-react";
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

function IdentitySection({
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
      document: company?.document ?? "",
      address: company?.address ?? "",
      footerText: company?.footerText ?? "",
      showContactData: company?.showContactData ?? true,
      showSignature: company?.showSignature ?? true,
    },
  });

  async function onSubmit(values: CompanyIdentityInput) {
    try {
      const accessToken = await getCurrentAccessToken();
      const result = await updateCompanyIdentity(accessToken, values);
      toast.success("Apresentacao comercial salva.");
      if (result.company) {
        onSaved?.(result.company);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel salvar a apresentacao.",
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <IdentitySection
          icon={UserRound}
          title="Nome e assinatura"
          description="Como voce aparece no cabecalho e no rodape do PDF."
        >
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
                <FormLabel>Subtitulo do documento</FormLabel>
                <FormControl>
                  <Input
                    disabled={form.formState.isSubmitting}
                    placeholder="Ex: Proposta comercial · Design e desenvolvimento"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Linha curta abaixo do nome, no topo de cada proposta.
                </FormDescription>
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
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="showContactData"
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
                    <FormLabel className="!mt-0">Mostrar contato no PDF</FormLabel>
                    <FormDescription>
                      Exibe WhatsApp, e-mail e canais no documento.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="showSignature"
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
                    <FormLabel className="!mt-0">Mostrar assinatura</FormLabel>
                    <FormDescription>
                      Nome e cargo no final do documento.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </IdentitySection>

        <IdentitySection
          icon={MapPin}
          title="Contato e dados fiscais"
          description="Informacoes que aparecem no rodape e na area de contato do PDF."
        >
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
                    placeholder="WhatsApp, e-mail, site ou redes."
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
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF ou CNPJ</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder="Opcional — aparece no rodape"
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
                      placeholder="Opcional — cidade ou endereco completo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </IdentitySection>

        <IdentitySection
          icon={FileText}
          title="Rodape do documento"
          description="Texto fixo no final de todas as propostas exportadas."
        >
          <FormField
            control={form.control}
            name="footerText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Texto do rodape</FormLabel>
                <FormControl>
                  <textarea
                    className="min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={form.formState.isSubmitting}
                    placeholder="Ex: Proposta valida conforme prazo indicado. Alteracoes fora do escopo serao orcadas separadamente."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Ideal para validade, observacoes legais ou mensagem institucional.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </IdentitySection>

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
