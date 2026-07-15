import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  FileText,
  Fingerprint,
  Layers3,
  LayoutTemplate,
  LockKeyhole,
  Palette,
  PenLine,
  Send,
  Sparkles,
  WandSparkles,
} from "lucide-react";

export const landingConfig = {
  nav: [
    { label: "Recursos", href: "#recursos" },
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Templates", href: "#templates" },
    { label: "Preços", href: "#precos" },
    { label: "Perguntas frequentes", href: "#faq" },
  ],
  hero: {
    badge: "Propostas comerciais mais claras e profissionais",
    title: "Venda seus serviços com propostas que valorizam o seu trabalho.",
    subtitle:
      "Configure sua empresa uma vez, personalize cada oportunidade e crie propostas comerciais consistentes sem começar do zero.",
    primaryCta: "Criar minha primeira proposta",
    secondaryCta: "Ver como funciona",
    note: "Comece gratuitamente • Sem cartão de crédito • Configure em poucos minutos",
  },
  problems: [
    {
      title: "Documentos genéricos",
      description:
        "Propostas iguais para clientes diferentes reduzem a percepção de valor.",
      icon: FileText,
    },
    {
      title: "Processo demorado",
      description:
        "Copiar textos, ajustar cores e reorganizar páginas consome tempo que poderia ser usado para vender.",
      icon: Clock3,
    },
    {
      title: "Falta de padrão",
      description:
        "Informações comerciais espalhadas dificultam manter consistência entre propostas.",
      icon: Layers3,
    },
    {
      title: "Baixa personalização",
      description:
        "Ferramentas tradicionais não facilitam adaptar a experiência para cada cliente.",
      icon: Fingerprint,
    },
  ],
  solutionSteps: [
    { title: "Configure sua empresa", status: "Disponível" },
    { title: "Defina sua identidade visual", status: "Disponível" },
    { title: "Crie uma proposta", status: "Em breve" },
    { title: "Personalize para o cliente", status: "Planejado" },
    { title: "Revise e compartilhe", status: "Planejado" },
  ],
  features: [
    {
      title: "Perfil da empresa",
      description:
        "Centralize informações comerciais, responsáveis, contatos e textos padrão.",
      icon: BriefcaseBusiness,
      status: "Disponível",
    },
    {
      title: "Identidade visual",
      description:
        "Configure cores, tipografia, estilo e aparência das suas propostas.",
      icon: Palette,
      status: "Disponível",
    },
    {
      title: "Onboarding guiado",
      description: "Prepare a base da sua empresa em três etapas curtas.",
      icon: BadgeCheck,
      status: "Disponível",
    },
    {
      title: "Autenticação segura",
      description: "Entre com e-mail, senha ou Google.",
      icon: LockKeyhole,
      status: "Disponível",
    },
    {
      title: "Propostas estruturadas",
      description:
        "Crie propostas com seções reutilizáveis e uma organização profissional.",
      icon: LayoutTemplate,
      status: "Em breve",
    },
    {
      title: "Assistente de conteúdo",
      description:
        "Transforme informações básicas em textos comerciais mais claros.",
      icon: Sparkles,
      status: "Em breve",
    },
    {
      title: "Preview e publicação",
      description: "Revise a experiência antes de compartilhar com o cliente.",
      icon: Send,
      status: "Em breve",
    },
    {
      title: "PDF e link público",
      description:
        "Compartilhe cada proposta no formato adequado para o cliente.",
      icon: FileText,
      status: "Em breve",
    },
  ],
  brandingModes: [
    {
      title: "Minha marca",
      description:
        "Use automaticamente o Brand Kit configurado durante o onboarding.",
      status: "Disponível",
      colors: ["#0F766E", "#14B8A6", "#F8FAFC"],
    },
    {
      title: "Marca do cliente",
      description:
        "Prepare propostas adaptadas à identidade de quem vai receber.",
      status: "Planejado",
      colors: ["#2563EB", "#F97316", "#EFF6FF"],
    },
    {
      title: "Combinar as marcas",
      description:
        "Apresente sua empresa com clareza enquanto cria uma experiência personalizada para o cliente.",
      status: "Planejado",
      colors: ["#0F766E", "#06B6D4", "#F8FAFC"],
    },
  ],
  templates: [
    {
      name: "Minimal",
      audience: "Freelancers e consultores",
      status: "Em breve",
    },
    {
      name: "Modern",
      audience: "Desenvolvedores e designers",
      status: "Em breve",
    },
    {
      name: "Premium",
      audience: "Agências e projetos de maior valor",
      status: "Em breve",
    },
    {
      name: "Client First",
      audience: "Propostas altamente personalizadas",
      status: "Em breve",
    },
  ],
  howItWorks: [
    {
      title: "Crie sua conta",
      description: "Cadastre-se com e-mail ou Google.",
      icon: LockKeyhole,
    },
    {
      title: "Configure sua empresa",
      description: "Adicione informações comerciais e identidade visual.",
      icon: Building2,
    },
    {
      title: "Crie sua proposta",
      description: "Informe cliente, objetivo, solução, prazo e investimento.",
      icon: PenLine,
    },
    {
      title: "Revise e compartilhe",
      description: "Visualize a proposta antes de enviar.",
      icon: Send,
    },
  ],
  audiences: [
    {
      title: "Freelancers",
      description: "Ganhe velocidade sem perder aparência profissional.",
    },
    {
      title: "Desenvolvedores",
      description: "Apresente escopo, prazos e investimento com clareza.",
    },
    {
      title: "Designers",
      description: "Mantenha estética consistente sem refazer layouts do zero.",
    },
    {
      title: "Agências",
      description:
        "Padronize propostas sem apagar a personalização de cada cliente.",
    },
    {
      title: "Consultores",
      description:
        "Organize diagnóstico, solução e próximos passos em um só fluxo.",
    },
    {
      title: "Social medias",
      description:
        "Monte propostas comerciais mais claras para serviços recorrentes.",
    },
  ],
  comparison: [
    ["Começar do zero", "Reutilizar a base da empresa"],
    ["Ajustar identidade manualmente", "Brand Kit centralizado"],
    ["Informações espalhadas", "Dados comerciais organizados"],
    ["Layout inconsistente", "Estruturas controladas"],
    ["Difícil personalização", "Personalização preparada para cada cliente"],
  ],
  pricing: [
    {
      name: "Gratuito",
      price: "R$ 0",
      description:
        "Para configurar a empresa e começar com uma base profissional.",
      status: "Disponível",
      cta: "Começar gratuitamente",
      highlighted: false,
      items: [
        "Configuração da empresa",
        "Identidade visual",
        "Até 3 propostas gratuitas futuramente",
        "Acesso ao painel",
        "Branding básico",
      ],
    },
    {
      name: "Pro",
      price: "R$ 49/mês",
      description: "Para quem quer volume, publicação e recursos avançados.",
      status: "Em breve",
      cta: "Quero ser avisado",
      highlighted: true,
      items: [
        "Até 50 novas propostas por mês",
        "Assistente de conteúdo com IA",
        "Templates premium",
        "Link público",
        "Exportação PDF",
        "Métricas de visualização",
        "Aceite e recusa",
        "Branding avançado",
      ],
    },
    {
      name: "Estúdio",
      price: "Sob consulta",
      description:
        "Planejado para equipes pequenas que precisam padronizar propostas.",
      status: "Planejado",
      cta: "Criar conta grátis",
      highlighted: false,
      items: [
        "Biblioteca de seções",
        "Templates por tipo de serviço",
        "Controle de identidade por cliente",
        "Fluxos internos de revisão",
      ],
    },
  ],
  faqs: [
    {
      question: "O Proposta AI já está disponível?",
      answer:
        "A base inicial de cadastro, autenticação e configuração da empresa já está sendo preparada. O editor completo de propostas está em desenvolvimento.",
    },
    {
      question: "Preciso de cartão de crédito?",
      answer:
        "Não. O cadastro inicial é gratuito e não exige cartão de crédito.",
    },
    {
      question: "Posso usar a identidade do meu cliente?",
      answer:
        "Esse modo está planejado para permitir propostas adaptadas à identidade de quem vai receber.",
    },
    {
      question: "A IA criará o layout inteiro?",
      answer:
        "Não. O produto usará templates profissionais controlados e IA como apoio de conteúdo, evitando layouts aleatórios.",
    },
    {
      question: "Posso baixar em PDF?",
      answer: "PDF é um recurso planejado para uma etapa futura do produto.",
    },
    {
      question: "O cliente precisará criar conta?",
      answer:
        "O fluxo planejado permitirá acessar propostas públicas sem conta.",
    },
    {
      question: "Para quem o produto é indicado?",
      answer:
        "Freelancers, agências, desenvolvedores, designers, consultores, social medias e outros prestadores B2B.",
    },
    {
      question: "Existe um plano gratuito?",
      answer:
        "Sim. A proposta do plano gratuito é permitir configurar a empresa e, futuramente, publicar até três propostas gratuitas.",
    },
  ],
  earlyAccessPrinciples: [
    "Simplicidade antes de complexidade",
    "Templates controlados em vez de layouts aleatórios",
    "Personalização como parte do processo comercial",
    "IA como apoio de escrita, não como improviso visual",
  ],
  decorativeIcons: { CheckCircle2, WandSparkles },
};
