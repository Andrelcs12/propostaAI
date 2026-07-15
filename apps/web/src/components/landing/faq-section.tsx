"use client";

import { ChevronDown } from "lucide-react";
import { landingConfig } from "@/config/landing";
import { SectionHeading } from "./section-heading";

export function FaqSection() {
  return (
    <section id="faq" className="border-y bg-secondary/45 py-16 md:py-20">
      <div className="container-page">
        <SectionHeading
          centered
          title="Perguntas frequentes"
          description="Respostas diretas sobre o que já existe e o que ainda está planejado."
        />
        <div className="mx-auto mt-10 grid max-w-3xl gap-3">
          {landingConfig.faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-lg border bg-card p-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {faq.question}
                <ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
