"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export async function getCurrentAccessToken() {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    throw new Error("Sessao expirada. Entre novamente.");
  }

  return session.access_token;
}
