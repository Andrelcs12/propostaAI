import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/painel/:path*",
    "/onboarding/:path*",
    "/minha-empresa/:path*",
    "/configuracoes/:path*",
    "/propostas/:path*",
    "/billing/:path*",
    "/login",
    "/cadastro",
    "/recuperar-senha",
    "/redefinir-senha",
  ],
};
