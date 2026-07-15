"use client";

import type {
  LoginInput,
  RecoverPasswordInput,
  RegisterInput,
  ResetPasswordInput
} from "@/features/auth/schemas/auth.schema";
import { apiFetch } from "@/lib/api/client";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export async function registerWithEmail(input: RegisterInput) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        name: input.name
      },
      emailRedirectTo: `${window.location.origin}/callback`
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.session?.access_token) {
    await syncCurrentUser(data.session.access_token);
  }

  return data;
}

export async function loginWithEmail(input: LoginInput) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data.session?.access_token) {
    await syncCurrentUser(data.session.access_token);
  }

  return data;
}

export async function loginWithGoogle() {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/callback`
    }
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function recoverPassword(input: RecoverPasswordInput) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
    redirectTo: `${window.location.origin}/redefinir-senha`
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function resetPassword(input: ResetPasswordInput) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.updateUser({
    password: input.password
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function logout() {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function syncCurrentUser(accessToken: string) {
  return apiFetch("/api/users/me", {
    accessToken
  });
}
