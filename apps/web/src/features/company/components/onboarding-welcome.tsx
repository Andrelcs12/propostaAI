import { Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  getUserAvatarUrl,
  getUserDisplayName,
  getUserFullName,
  getUserInitials,
} from "@/lib/auth/display-name";
import type { User as SupabaseUser } from "@supabase/supabase-js";

type OnboardingWelcomeProps = {
  user: SupabaseUser;
};

export function OnboardingWelcome({ user }: OnboardingWelcomeProps) {
  const firstName = getUserDisplayName(user);
  const fullName = getUserFullName(user);
  const avatarUrl = getUserAvatarUrl(user);
  const initials = getUserInitials(fullName);

  return (
    <div className="relative border-b border-border/60 bg-[linear-gradient(135deg,color-mix(in_oklch,var(--primary)_10%,transparent),transparent_55%)] px-5 py-5 sm:px-7 sm:py-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-primary/10 blur-2xl"
      />

      <div className="relative flex items-start gap-4">
        <Avatar className="size-12 shrink-0 border border-primary/15 sm:size-14">
          <AvatarImage src={avatarUrl ?? undefined} alt={fullName} />
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
            <Sparkles className="size-3" />
            Primeiro acesso
          </span>
          <h1 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
            Ola, {firstName}.{" "}
            <span className="text-primary">Vamos configurar sua base.</span>
          </h1>
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
            Perfil, identidade visual e padroes das propostas — em cerca de 5
            minutos voce sai pronto para criar propostas profissionais.
          </p>
        </div>
      </div>
    </div>
  );
}
