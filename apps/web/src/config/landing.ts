import { BarChart3, CheckCircle2, CreditCard, LockKeyhole, Rocket, ShieldCheck } from "lucide-react";

export const landingConfig = {
  brand: "Novely SaaS Template",
  nav: [
    { label: "Beneficios", href: "#beneficios" },
    { label: "Funcionalidades", href: "#funcionalidades" },
    { label: "Preco", href: "#preco" },
    { label: "FAQ", href: "#faq" }
  ],
  hero: {
    title: "Comece um MicroSaaS com a base certa.",
    subtitle:
      "Um template limpo para validar produtos da Novely com landing, autenticacao, Prisma, Supabase e estrutura inicial de billing.",
    primaryCta: "Criar conta",
    secondaryCta: "Ver estrutura"
  },
  benefits: [
    {
      title: "Menos setup",
      description: "Monorepo, apps e pacotes prontos para iniciar um produto novo."
    },
    {
      title: "Auth real",
      description: "Cadastro, login, Google OAuth e rota protegida usando Supabase Auth."
    },
    {
      title: "Evolucao segura",
      description: "Stripe fica preparado, sem cobrar ou criar assinatura nesta versao."
    }
  ],
  features: [
    { title: "Next.js App Router", description: "Frontend moderno com páginas finas e componentes reutilizáveis.", icon: Rocket },
    { title: "NestJS + Fastify", description: "API simples, validada e pronta para deploy no Render.", icon: ShieldCheck },
    { title: "Prisma + Postgres", description: "Usuario persistido de forma idempotente pelo Supabase ID.", icon: BarChart3 },
    { title: "Supabase Auth", description: "Sessao via cookies, sem tokens proprios no frontend.", icon: LockKeyhole },
    { title: "Stripe estrutural", description: "Base preparada para checkout futuro, sem cobrança real.", icon: CreditCard },
    { title: "CI inicial", description: "Lint, typecheck, testes, build e Prisma generate no GitHub Actions.", icon: CheckCircle2 }
  ],
  steps: [
    "Configure Supabase e variaveis de ambiente.",
    "Execute as migrations do Prisma.",
    "Valide cadastro, login e acesso ao painel.",
    "Evolua o produto sem carregar complexidade desnecessaria."
  ],
  pricing: {
    name: "Plano Inicial",
    price: "Ilustrativo",
    description: "Estrutura preparada para monetizacao futura.",
    items: ["Landing e autenticacao", "Painel protegido", "API base", "Stripe em modo estrutural"]
  },
  faqs: [
    {
      question: "Este template ja cobra clientes?",
      answer: "Nao. O Stripe esta apenas estruturado para evolucao futura."
    },
    {
      question: "Existe multi-tenancy?",
      answer: "Nao. Esta versao tem somente usuario autenticado e perfil persistido."
    },
    {
      question: "Posso usar como GitHub Template?",
      answer: "Sim. A documentacao inclui os passos para publicar e reutilizar."
    }
  ]
};
