"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { recoverPasswordSchema, type RecoverPasswordInput } from "@/features/auth/schemas/auth.schema";
import { recoverPassword } from "@/features/auth/services/auth.service";

export function RecoverPasswordForm() {
  const form = useForm<RecoverPasswordInput>({
    resolver: zodResolver(recoverPasswordSchema),
    defaultValues: {
      email: ""
    }
  });

  async function onSubmit(values: RecoverPasswordInput) {
    try {
      await recoverPassword(values);
      toast.success("Enviamos o link de recuperacao para seu e-mail.");
      form.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Nao foi possivel enviar o e-mail.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" placeholder="voce@empresa.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2 className="animate-spin" /> : null}
          Enviar link
        </Button>
      </form>
    </Form>
  );
}
