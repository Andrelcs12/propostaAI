"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  companyBrandSchema,
  type CompanyBrandInput,
} from "../schemas/company.schema";
import { updateCompanyBrand } from "../services/company.service";
import { getCurrentAccessToken } from "../services/session-token.service";
import type { Company } from "../types/company";
import { BrandPreview } from "./brand-preview";
import { LogoUploadField } from "./logo-upload-field";
import { TemplatePicker } from "./template-picker";
import type { VisualStyleId } from "@/config/templates";

type CompanyBrandFormProps = {
  company: Company | null;
  submitLabel: string;
  embedded?: boolean;
  onSaved?: (company: Company) => void;
};

const selectClassName =
  "h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

function FormSection({
  embedded,
  title,
  description,
  children,
}: {
  embedded?: boolean;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  if (embedded) {
    return (
      <section className="space-y-4 border-b border-border/60 pb-6 last:border-b-0 last:pb-0">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </section>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function CompanyBrandForm({
  company,
  submitLabel,
  embedded,
  onSaved,
}: CompanyBrandFormProps) {
  const form = useForm<CompanyBrandInput>({
    resolver: zodResolver(companyBrandSchema),
    defaultValues: {
      logoUrl: company?.logoUrl ?? "",
      lightLogoUrl: company?.lightLogoUrl ?? "",
      primaryColor: company?.primaryColor ?? "#0F766E",
      secondaryColor: company?.secondaryColor ?? "#14B8A6",
      accentColor: company?.accentColor ?? "#06B6D4",
      backgroundColor: company?.backgroundColor ?? "#F8FAFC",
      surfaceColor: company?.surfaceColor ?? "#FFFFFF",
      textColor: company?.textColor ?? "#0F172A",
      visualPreference: company?.visualPreference ?? "LIGHT",
      fontPreference: company?.fontPreference ?? "INTER",
      visualStyle: company?.visualStyle ?? "MINIMAL",
      borderRadius: company?.borderRadius ?? "MEDIUM",
    },
  });
  const brand = form.watch();

  async function onSubmit(values: CompanyBrandInput) {
    try {
      const accessToken = await getCurrentAccessToken();
      const result = await updateCompanyBrand(accessToken, values);
      toast.success("Identidade visual salva.");

      if (result.company) {
        onSaved?.(result.company);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel salvar a identidade visual.",
      );
    }
  }

  return (
    <div
      className={
        embedded
          ? "grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]"
          : "grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]"
      }
    >
      <div className={embedded ? "space-y-6" : "space-y-6"}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormSection
              embedded={embedded ?? false}
              title="Logo da empresa"
              description="Envie a imagem da sua marca. Ela aparece nas propostas e no preview."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <LogoUploadField
                          label="Logo principal"
                          description="Usada na maioria das propostas."
                          value={field.value ?? ""}
                          disabled={form.formState.isSubmitting}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lightLogoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <LogoUploadField
                          label="Logo clara (opcional)"
                          description="Para fundos escuros ou templates dark."
                          value={field.value ?? ""}
                          variant="light"
                          disabled={form.formState.isSubmitting}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>

            <FormSection
              embedded={embedded ?? false}
              title="Cores da empresa"
              description="Defina a paleta usada em todas as propostas e no preview ao vivo."
            >
              <div className="grid gap-4 md:grid-cols-2">
                {(
                  [
                    "primaryColor",
                    "secondaryColor",
                    "accentColor",
                    "backgroundColor",
                    "surfaceColor",
                    "textColor",
                  ] as const
                ).map((name) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {
                            {
                              primaryColor: "Cor principal",
                              secondaryColor: "Cor secundaria",
                              accentColor: "Cor de destaque",
                              backgroundColor: "Cor de fundo",
                              surfaceColor: "Cor de superficie",
                              textColor: "Cor do texto",
                            }[name]
                          }
                        </FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-[48px_1fr] gap-2">
                            <Input
                              type="color"
                              disabled={form.formState.isSubmitting}
                              {...field}
                            />
                            <Input
                              disabled={form.formState.isSubmitting}
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </FormSection>

            <FormSection
              embedded={embedded ?? false}
              title="Tipografia e acabamento"
              description="Ajuste fonte, tema e arredondamento dos elementos."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="visualPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferencia visual</FormLabel>
                      <FormControl>
                        <select
                          className={selectClassName}
                          disabled={form.formState.isSubmitting}
                          {...field}
                        >
                          <option value="LIGHT">Clara</option>
                          <option value="DARK">Escura</option>
                          <option value="AUTO">Automatica</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fontPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipografia</FormLabel>
                      <FormControl>
                        <select
                          className={selectClassName}
                          disabled={form.formState.isSubmitting}
                          {...field}
                        >
                          <option value="INTER">Inter</option>
                          <option value="MANROPE">Manrope</option>
                          <option value="POPPINS">Poppins</option>
                          <option value="DM_SANS">DM Sans</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="borderRadius"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Arredondamento</FormLabel>
                      <FormControl>
                        <select
                          className={selectClassName}
                          disabled={form.formState.isSubmitting}
                          {...field}
                        >
                          <option value="SMALL">Pequeno</option>
                          <option value="MEDIUM">Medio</option>
                          <option value="LARGE">Grande</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </FormSection>

            <FormSection
              embedded={embedded ?? false}
              title="Modelo de proposta"
              description="Escolha o template visual. O preview ao lado atualiza em tempo real."
            >
              <FormField
                control={form.control}
                name="visualStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TemplatePicker
                        value={field.value}
                        disabled={form.formState.isSubmitting}
                        onChange={(value: VisualStyleId) =>
                          field.onChange(value)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </FormSection>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : null}
              {submitLabel}
            </Button>
          </form>
        </Form>
      </div>

      <BrandPreview company={company} brand={brand} />
    </div>
  );
}
