import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Criar conta no Proposta AI"
      description="Comece configurando a base para suas propostas comerciais."
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
