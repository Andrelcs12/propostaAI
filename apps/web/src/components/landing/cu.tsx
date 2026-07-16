"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { 
  Building2, 
  CreditCard, 
  Wallet, 
  Landmark, 
  Coins, 
  Webhook, 
  LayoutDashboard, 
  FileText,
  ShieldCheck 
} from "lucide-react";

// Input: Instituições Financeiras (Esquerda)
const sourceBanks = [
  { name: "Itaú", icon: Building2, x: 80, y: 80, color: "text-orange-500" },
  { name: "Nubank", icon: CreditCard, x: 160, y: 170, color: "text-purple-500" },
  { name: "Santander", icon: Landmark, x: 80, y: 260, color: "text-red-600" },
  { name: "Inter", icon: Wallet, x: 160, y: 350, color: "text-orange-400" },
  { name: "BTG Pactual", icon: Coins, x: 80, y: 440, color: "text-blue-900" },
];

// Output: Destinos (Direita)
const destinations = [
  { name: "Webhooks", icon: Webhook, x: 960, y: 140, color: "text-emerald-500" },
  { name: "Dashboard", icon: LayoutDashboard, x: 1040, y: 260, color: "text-blue-500" },
  { name: "Faturamento", icon: FileText, x: 960, y: 380, color: "text-violet-500" },
];

export function IntegrationsAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const centerX = 600;
  const centerY = 280;

  useEffect(() => {
    // gsap.context garante que todas as animações sejam limpas quando o componente for desmontado
    const ctx = gsap.context(() => {
      // 1. Setup inicial para evitar flash visual de conteúdo não estilizado (FOUC)
      gsap.set(".bank-card", { opacity: 0, x: -30 });
      gsap.set(".dest-card", { opacity: 0, x: 30 });
      gsap.set(".core-node", { scale: 0.8, opacity: 0 });
      gsap.set(".flow-path-left, .flow-path-right", { strokeDashoffset: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // 2. Animação de Entrada Sequencial
      tl.to(".core-node", {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      })
      .to(".bank-card", {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.08,
      }, "-=0.3")
      .to(".dest-card", {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
      }, "-=0.4");

      // 3. Animação infinita de pulso no Core Central
      gsap.to(".core-node", {
        scale: 1.04,
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
      });

      // 4. Animação infinita das linhas SVG (Efeito Flowing Dash)
      gsap.to(".flow-path-left", {
        strokeDashoffset: -28,
        duration: 1.2,
        repeat: -1,
        ease: "none",
      });

      gsap.to(".flow-path-right", {
        strokeDashoffset: -28,
        duration: 1.2,
        repeat: -1,
        ease: "none",
      });

      // Hover dinâmico nos cards via GSAP (muito mais performático que estados React)
      const cards = gsap.utils.toArray<HTMLElement>(".bank-card, .dest-card");
      cards.forEach((card) => {
        const isLeft = card.classList.contains("bank-card");
        const activeColor = isLeft ? "#ff204e" : "#10b981";

        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            scale: 1.03,
            borderColor: activeColor,
            duration: 0.2,
            overwrite: "auto",
          });
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            scale: 1,
            borderColor: "#e2e8f0", // Cor do Tailwind slate-200
            duration: 0.2,
            overwrite: "auto",
          });
        });
      });

    }, containerRef);

    // Cleanup: previne memory leaks e animações "fantasmas"
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className="relative mx-auto h-[600px] w-full max-w-7xl overflow-hidden bg-slate-50 rounded-2xl border border-slate-100 select-none"
    >
      {/* Header */}
      <div className="relative z-20 mx-auto max-w-3xl pt-12 text-center px-4">
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Conecte seu sistema a instituições financeiras em uma única API
        </h2>
        <p className="mt-4 text-lg text-slate-500">
          Orquestre múltiplos gateways, splits de pagamento e conciliação sem fricção.
        </p>
      </div>

      {/* Grid de Linhas SVG */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 600"
        fill="none"
      >
        {/* Linhas da Esquerda para o Centro */}
        {sourceBanks.map((bank) => {
          const startX = bank.x + 176; // x + largura do card (176px)
          const startY = bank.y + 28;  // y + metade da altura (56px / 2)

          return (
            <path
              key={`line-src-${bank.name}`}
              className="flow-path-left"
              d={`M ${startX} ${startY} C ${(startX + centerX) / 2} ${startY}, ${(startX + centerX) / 2} ${centerY}, ${centerX} ${centerY}`}
              stroke="#ff204e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 8"
              opacity="0.3"
            />
          );
        })}

        {/* Linhas do Centro para a Direita */}
        {destinations.map((dest) => {
          const endX = dest.x;
          const endY = dest.y + 28;

          return (
            <path
              key={`line-dest-${dest.name}`}
              className="flow-path-right"
              d={`M ${centerX} ${centerY} C ${(centerX + endX) / 2} ${centerY}, ${(centerX + endX) / 2} ${endY}, ${endX} ${endY}`}
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 8"
              opacity="0.3"
            />
          );
        })}
      </svg>

      {/* Cards da Esquerda (Bancos) */}
      {sourceBanks.map((bank) => {
        const Icon = bank.icon;
        return (
          <div
            key={bank.name}
            className="bank-card absolute z-10 flex h-14 w-44 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-colors duration-150"
            style={{ left: bank.x, top: bank.y }}
          >
            <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 ${bank.color}`}>
              <Icon className="size-5" />
            </div>
            <span className="text-sm font-semibold text-slate-700">{bank.name}</span>
          </div>
        );
      })}

      {/* Nó Central (Sua Infraestrutura / API) */}
      <div
        className="core-node absolute z-20 flex size-24 items-center justify-center rounded-2xl bg-slate-900 shadow-xl"
        style={{ left: centerX - 48, top: centerY - 48 }}
      >
        <div className="absolute -inset-1 animate-pulse rounded-2xl bg-gradient-to-r from-rose-500 to-emerald-500 opacity-30 blur" />
        <div className="relative flex flex-col items-center text-white">
          <ShieldCheck className="size-8 text-rose-500" />
          <span className="mt-1 text-[10px] font-bold tracking-wider uppercase opacity-80">Core API</span>
        </div>
      </div>

      {/* Cards da Direita (Destinos) */}
      {destinations.map((dest) => {
        const Icon = dest.icon;
        return (
          <div
            key={dest.name}
            className="dest-card absolute z-10 flex h-14 w-44 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-colors duration-150"
            style={{ left: dest.x, top: dest.y }}
          >
            <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 ${dest.color}`}>
              <Icon className="size-5" />
            </div>
            <span className="text-sm font-semibold text-slate-700">{dest.name}</span>
          </div>
        );
      })}
    </section>
  );
}