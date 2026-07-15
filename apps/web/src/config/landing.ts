import {
  BadgeCheck,
  BriefcaseBusiness,
  FileText,
  Palette,
  Send,
  Sparkles,
} from "lucide-react";

export const landingConfig = {
  brand: "Proposta AI",
  nav: [
    { label: "Beneficios", href: "#beneficios" },
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Preco", href: "#preco" },
    { label: "FAQ", href: "#faq" },
  ],
  hero: {
    title: "Propostas comerciais profissionais em poucos minutos.",
    subtitle:
      "Organize as informacoes da sua empresa, mantenha um padrao visual e prepare propostas mais claras para clientes B2B.",
    primaryCta: "Criar conta",
    secondaryCta: "Ver como funciona",
  },
  benefits: [
    {
      title: "Mais clareza na venda",
      description:
        "Transforme escopo, prazos e valores em uma apresentacao comercial facil de entender.",
    },
    {
      title: "Padrao profissional",
      description:
        "Use dados, cores e textos da sua empresa como base para propostas consistentes.",
    },
    {
      title: "Menos retrabalho",
      description:
        "Comece com uma estrutura simples para freelancers, agencias, devs e consultores.",
    },
  ],
  features: [
    {
      title: "Cadastro da empresa",
      description:
        "Centralize nome, segmento, contato e apresentacao comercial.",
      icon: BriefcaseBusiness,
    },
    {
      title: "Identidade visual",
      description:
        "Prepare cores, logo e preferencias para manter uma proposta coerente.",
      icon: Palette,
    },
    {
      title: "Propostas guiadas",
      description:
        "Base pronta para evoluir para criacao de propostas por etapas.",
      icon: FileText,
    },
    {
      title: "Envio profissional",
      description:
        "Estrutura pensada para compartilhar propostas com mais confianca.",
      icon: Send,
    },
    {
      title: "Apoio de IA",
      description:
        "IA entra depois, como assistente de escrita, sem substituir seu criterio.",
      icon: Sparkles,
    },
    {
      title: "Fluxo seguro",
      description:
        "Autenticacao preservada e base preparada para onboarding da empresa.",
      icon: BadgeCheck,
    },
  ],
  steps: [
    "Crie sua conta e acesse o ambiente protegido.",
    "Configure os dados principais da sua empresa.",
    "Defina o kit visual que sera usado nas propostas.",
    "Comece a montar propostas comerciais com um fluxo guiado.",
  ],
  pricing: {
    name: "Acesso inicial",
    price: "Em breve",
    description: "Primeira versao focada em validar o fluxo de propostas.",
    items: [
      "Cadastro e login",
      "Base da empresa",
      "Brand Kit",
      "Painel de propostas",
    ],
  },
  faqs: [
    {
      question: "O Proposta AI ja gera propostas com IA?",
      answer:
        "Ainda nao nesta etapa. A base visual, autenticacao e dados da empresa vem primeiro.",
    },
    {
      question: "Serve para quem vende servicos?",
      answer:
        "Sim. O foco inicial e freelancer, agencia, desenvolvedor, designer, consultor e prestador B2B.",
    },
    {
      question: "Preciso configurar Supabase?",
      answer:
        "Sim. Login por e-mail e Google dependem das chaves e provedores configurados no Supabase.",
    },
  ],
};
