"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Separator } from "@/components/ui/separator";
import {
  loginSchema,
  type LoginInput,
} from "@/features/auth/schemas/auth.schema";
import {
  loginWithEmail,
  loginWithGoogle,
} from "@/features/auth/services/auth.service";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [googleLoading, setGoogleLoading] = useState(false);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginInput) {
    try {
      await loginWithEmail(values);
      toast.success("Login realizado com sucesso.");
      router.push(searchParams.get("next") ?? "/painel");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Nao foi possivel entrar.",
      );
    }
  }

  async function handleGoogleLogin() {
    try {
      setGoogleLoading(true);
      await loginWithGoogle();
    } catch (error) {
      setGoogleLoading(false);
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel iniciar o Google OAuth.",
      );
    }
  }

  return (
    <div className="space-y-5">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
      >
        {googleLoading ? <Loader2 className="animate-spin" /> : null}
        Entrar com Google
      </Button>
      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">ou</span>
        <Separator className="flex-1" />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="voce@empresa.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="current-password"
                    placeholder="Sua senha"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : null}
            Entrar no Proposta AI
          </Button>
        </form>
      </Form>
    </div>
  );
}
