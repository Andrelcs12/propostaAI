import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { RecoverPasswordForm } from "@/features/auth/components/recover-password-form";

export default function RecoverPasswordPage() {
  return (
    <AuthShell
      title="Recuperar senha"
      description="Informe seu e-mail para receber o link de recuperacao."
      footer={
        <Link href="/login" className="font-medium text-foreground">
          Voltar para login
        </Link>
      }
    >
      <RecoverPasswordForm />
    </AuthShell>
  );
}
