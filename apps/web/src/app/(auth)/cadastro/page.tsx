import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Criar conta"
      description="Cadastre-se para validar a autenticacao do template."
      footer={
        <>
          Ja tem conta?{" "}
          <Link href="/login" className="font-medium text-foreground">
            Entrar
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
