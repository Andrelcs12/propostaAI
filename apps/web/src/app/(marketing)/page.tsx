"use client";

import { LandingPage } from "@/components/landing/landing-page";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    console.table({
      NEXT_PUBLIC_API_URL: {
        loaded: Boolean(process.env.NEXT_PUBLIC_API_URL),
        value: process.env.NEXT_PUBLIC_API_URL ?? "NÃO CARREGADA",
      },
      NEXT_PUBLIC_SUPABASE_URL: {
        loaded: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        value: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "NÃO CARREGADA",
      },
      NEXT_PUBLIC_SUPABASE_ANON_KEY: {
        loaded: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(0, 12)}...`
          : "NÃO CARREGADA",
      },
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: {
        loaded: Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY),
        value: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
          ? `${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.slice(0, 18)}...`
          : "NÃO CARREGADA",
      },
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: {
        loaded: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
        value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
          ? `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.slice(0, 12)}...`
          : "NÃO CARREGADA",
      },
      NEXT_PUBLIC_APP_URL: {
        loaded: Boolean(process.env.NEXT_PUBLIC_APP_URL),
        value: process.env.NEXT_PUBLIC_APP_URL ?? "NÃO CARREGADA",
      },
    });
  }, []);

  return <LandingPage />;
}