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
  companyBrandSchema,
  type CompanyBrandInput,
} from "../schemas/company.schema";
import { updateCompanyBrand } from "../services/company.service";
import { getCurrentAccessToken } from "../services/session-token.service";
import type { Company } from "../types/company";
import { BrandPreview } from "./brand-preview";

type CompanyBrandFormProps = {
  company: Company | null;
  submitLabel: string;
  onSaved?: (company: Company) => void;
};

const selectClassName =
  "h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export function CompanyBrandForm({
  company,
  submitLabel,
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
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da logo</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder="https://..."
                      {...field}
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
                  <FormLabel>URL da logo clara</FormLabel>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder="https://..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
              name="visualStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estilo visual</FormLabel>
                  <FormControl>
                    <select
                      className={selectClassName}
                      disabled={form.formState.isSubmitting}
                      {...field}
                    >
                      <option value="MINIMAL">Minimal</option>
                      <option value="MODERN">Moderno</option>
                      <option value="PREMIUM">Premium</option>
                      <option value="BOLD">Marcante</option>
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
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : null}
            {submitLabel}
          </Button>
        </form>
      </Form>
      <BrandPreview company={company} brand={brand} />
    </div>
  );
}
