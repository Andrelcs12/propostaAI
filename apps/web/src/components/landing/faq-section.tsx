"use client";

import { ChevronDown } from "lucide-react";
import { landingConfig } from "@/config/landing";
import { SectionHeading } from "./section-heading";

export function FaqSection() {
  return (
    <section id="faq" className="border-y bg-secondary/45 py-16 md:py-24">
      <div className="container-page">
        <SectionHeading
          centered
          eyebrow="FAQ"
          title="Perguntas frequentes"
          description="Transparência sobre o que já funciona hoje e o que entra nas próximas entregas."
        />

        <div className="mx-auto mt-10 grid max-w-5xl gap-3 lg:grid-cols-2 lg:items-start">
          {landingConfig.faqs.map((faq, index) => (
            <details
              key={faq.question}
              open={index === 0}
              className="group rounded-xl border bg-card/95 p-4 shadow-sm transition-colors open:border-primary/25 open:bg-card"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-medium leading-6">
                <span>{faq.question}</span>
                <ChevronDown className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
