import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Redefinir senha" description="Crie uma nova senha para sua conta." footer={null}>
      <ResetPasswordForm />
    </AuthShell>
  );
}
