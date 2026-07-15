import Link from "next/link";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      title="Entrar"
      description="Acesse sua conta para abrir o painel protegido."
      footer={
        <>
          Ainda nao tem conta?{" "}
          <Link href="/cadastro" className="font-medium text-foreground">
            Cadastre-se
          </Link>
          <br />
          <Link href="/recuperar-senha" className="font-medium text-foreground">
            Esqueci minha senha
          </Link>
        </>
      }
    >
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
