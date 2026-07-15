"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
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
  registerSchema,
  type RegisterInput,
} from "@/features/auth/schemas/auth.schema";
import {
  loginWithGoogle,
  registerWithEmail,
} from "@/features/auth/services/auth.service";

export function RegisterForm() {
  const router = useRouter();
  const [googleLoading, setGoogleLoading] = useState(false);
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterInput) {
    try {
      const data = await registerWithEmail(values);
      toast.success(
        data.session
          ? "Conta criada com sucesso."
          : "Verifique seu e-mail para confirmar a conta.",
      );
      router.push(data.session ? "/painel" : "/login");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Nao foi possivel criar sua conta.",
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
        Criar conta com Google
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="name"
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
                    autoComplete="new-password"
                    placeholder="Minimo de 6 caracteres"
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
            Criar conta gratuita
          </Button>
        </form>
      </Form>
    </div>
  );
}
