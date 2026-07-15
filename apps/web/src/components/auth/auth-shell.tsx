import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AuthShellProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthShell({ title, description, children, footer }: AuthShellProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>
            {children}
            <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
          </CardContent>
        </Card>
        <div className="mt-6 text-center text-sm">
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
            Voltar para a landing
          </Link>
        </div>
      </div>
    </main>
  );
}
