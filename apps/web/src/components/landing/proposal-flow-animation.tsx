"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Building2,
  Palette,
  Fingerprint,
  PenLine,
  CircleDollarSign,
  Sparkles,
  LayoutTemplate,
  WandSparkles,
  Send,
  FileText,
} from "lucide-react";

const inputs = [
  {
    name: "Perfil da empresa",
    icon: Building2,
    x: 60,
    y: 55,
    color: "text-primary",
  },
  {
    name: "Identidade visual",
    icon: Palette,
    x: 130,
    y: 130,
    color: "text-violet-500",
  },
  {
    name: "Dados do cliente",
    icon: Fingerprint,
    x: 60,
    y: 205,
    color: "text-sky-500",
  },
  {
    name: "Escopo e prazo",
    icon: PenLine,
    x: 130,
    y: 280,
    color: "text-amber-600",
  },
  {
    name: "Investimento",
    icon: CircleDollarSign,
    x: 60,
    y: 355,
    color: "text-emerald-600",
  },
];

const outputs = [
  {
    name: "Proposta estruturada",
    icon: LayoutTemplate,
    x: 820,
    y: 95,
    color: "text-primary",
  },
  {
    name: "Texto com IA",
    icon: WandSparkles,
    x: 890,
    y: 190,
    color: "text-violet-500",
  },
  {
    name: "PDF e link público",
    icon: Send,
    x: 820,
    y: 285,
    color: "text-emerald-600",
  },
];

const centerX = 500;
const centerY = 230;

export function ProposalFlowAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sparkRef = useRef<SVGSVGElement>(null);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);
  const outputRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const core = coreRef.current;
    const glow = glowRef.current;
    const spark = sparkRef.current;
    if (!container || !core || !glow || !spark) return;

    const inputCards = inputRefs.current.filter(Boolean) as HTMLDivElement[];
    const outputCards = outputRefs.current.filter(Boolean) as HTMLDivElement[];
    const dots = spark.querySelectorAll(".flow-dot");

    const ctx = gsap.context(() => {
      gsap.set(core, { opacity: 0, scale: 0.5 });
      gsap.set(glow, { opacity: 0, scale: 0.7 });
      gsap.set(inputCards, { opacity: 0, x: -48 });
      gsap.set(outputCards, { opacity: 0, x: 48 });
      gsap.set(dots, { opacity: 0, scale: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(core, {
        opacity: 1,
        scale: 1,
        duration: 0.75,
        ease: "back.out(2)",
      })
        .to(
          glow,
          {
            opacity: 0.55,
            scale: 1,
            duration: 0.45,
          },
          "-=0.45",
        )
        .to(
          inputCards,
          {
            opacity: 1,
            x: 0,
            duration: 0.55,
            stagger: 0.09,
            ease: "back.out(1.4)",
          },
          "-=0.35",
        )
        .to(
          outputCards,
          {
            opacity: 1,
            x: 0,
            duration: 0.55,
            stagger: 0.11,
            ease: "back.out(1.4)",
          },
          "-=0.45",
        )
        .to(
          dots,
          {
            opacity: 1,
            scale: 1,
            duration: 0.35,
            stagger: 0.06,
          },
          "-=0.25",
        );

      gsap.to(core, {
        scale: 1.08,
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      gsap.to(glow, {
        scale: 1.5,
        opacity: 0,
        duration: 2,
        repeat: -1,
        ease: "power1.out",
      });

      inputCards.forEach((card, index) => {
        gsap.to(card, {
          y: index % 2 === 0 ? -6 : 6,
          duration: 2.2 + index * 0.12,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: index * 0.15,
        });
      });

      outputCards.forEach((card, index) => {
        gsap.to(card, {
          y: index % 2 === 0 ? 6 : -6,
          duration: 2.4 + index * 0.12,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: 0.3 + index * 0.15,
        });
      });

      dots.forEach((dot, index) => {
        const isInput = index < inputs.length;
        const target = isInput ? inputs[index] : outputs[index - inputs.length];
        if (!target) return;
        const startX = isInput ? target.x + 176 : centerX;
        const startY = isInput ? target.y + 24 : centerY;
        const endX = isInput ? centerX : target.x;
        const endY = isInput ? centerY : target.y + 24;

        gsap
          .timeline({ repeat: -1, delay: index * 0.35 })
          .set(dot, { attr: { cx: startX, cy: startY }, opacity: 0, scale: 1 })
          .to(dot, { opacity: 0.95, duration: 0.15 })
          .to(
            dot,
            {
              attr: { cx: endX, cy: endY },
              duration: isInput ? 1.6 : 1.9,
              ease: "power1.inOut",
            },
            "<",
          )
          .to(dot, { opacity: 0, duration: 0.2 });
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section className="border-y border-border/80 bg-muted/20 py-12 md:py-16">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Do briefing à proposta
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Sua base comercial vira proposta profissional em um fluxo só
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Centralize empresa, identidade e briefing. O Proposta AI organiza
            tudo em uma proposta clara, consistente e pronta para compartilhar.
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative mx-auto mt-8 h-[320px] w-full max-w-5xl overflow-hidden rounded-xl border border-border bg-card/60 select-none sm:h-[380px] md:h-[420px]"
        >
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 1000 420"
            fill="none"
            aria-hidden
          >
            {inputs.map((input) => {
              const startX = input.x + 176;
              const startY = input.y + 24;

              return (
                <path
                  key={`line-input-${input.name}`}
                  className="proposal-flow-line"
                  d={`M ${startX} ${startY} C ${(startX + centerX) / 2} ${startY}, ${(startX + centerX) / 2} ${centerY}, ${centerX} ${centerY}`}
                  stroke="#0f766e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="6 8"
                />
              );
            })}

            {outputs.map((output) => {
              const endX = output.x;
              const endY = output.y + 24;

              return (
                <path
                  key={`line-output-${output.name}`}
                  className="proposal-flow-line"
                  style={{ animationDelay: "0.6s" }}
                  d={`M ${centerX} ${centerY} C ${(centerX + endX) / 2} ${centerY}, ${(centerX + endX) / 2} ${endY}, ${endX} ${endY}`}
                  stroke="#14b8a6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="6 8"
                />
              );
            })}
          </svg>

          <svg
            ref={sparkRef}
            className="pointer-events-none absolute inset-0 z-[5] h-full w-full"
            viewBox="0 0 1000 420"
            fill="none"
            aria-hidden
          >
            {[...inputs, ...outputs].map((item, index) => (
              <circle
                key={`dot-${item.name}`}
                className="flow-dot"
                r="4"
                fill={index < inputs.length ? "#0f766e" : "#14b8a6"}
              />
            ))}
          </svg>

          {inputs.map((input, index) => {
            const Icon = input.icon;
            return (
              <div
                key={input.name}
                ref={(node) => {
                  inputRefs.current[index] = node;
                }}
                className="absolute z-10 flex h-12 w-40 cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-background p-2.5 shadow-sm transition-[transform,border-color,box-shadow] duration-200 hover:scale-[1.03] hover:border-primary hover:shadow-md sm:w-44"
                style={{ left: input.x, top: input.y }}
              >
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary ${input.color}`}
                >
                  <Icon className="size-4" />
                </div>
                <span className="text-xs font-medium leading-tight">
                  {input.name}
                </span>
              </div>
            );
          })}

          <div
            ref={coreRef}
            className="absolute z-20 flex size-16 items-center justify-center rounded-xl bg-foreground shadow-lg sm:size-20"
            style={{ left: centerX - 32, top: centerY - 32 }}
          >
            <div
              ref={glowRef}
              className="absolute inset-0 rounded-xl bg-primary/30"
            />
            <div className="relative flex flex-col items-center text-background">
              <div className="core-icon relative">
                <FileText className="size-5 text-primary sm:size-6" />
                <Sparkles className="absolute -right-2 -top-2 size-3 text-primary" />
              </div>
              <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider opacity-80">
                Proposta AI
              </span>
            </div>
          </div>

          {outputs.map((output, index) => {
            const Icon = output.icon;
            return (
              <div
                key={output.name}
                ref={(node) => {
                  outputRefs.current[index] = node;
                }}
                className="absolute z-10 flex h-12 w-40 cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-background p-2.5 shadow-sm transition-[transform,border-color,box-shadow] duration-200 hover:scale-[1.03] hover:border-primary hover:shadow-md sm:w-44"
                style={{ left: output.x, top: output.y }}
              >
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary ${output.color}`}
                >
                  <Icon className="size-4" />
                </div>
                <span className="text-xs font-medium leading-tight">
                  {output.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
