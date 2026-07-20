import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Clock3,
  Code2,
  FileText,
  Fingerprint,
  Layers3,
  LayoutTemplate,
  LineChart,
  LockKeyhole,
  Megaphone,
  Palette,
  PenLine,
  Send,
  Sparkles,
  UserRound,
  WandSparkles,
  Zap,
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
    { title: "Crie uma proposta", status: "Disponível" },
    { title: "Gere e edite com IA", status: "Disponível" },
    { title: "Revise e compartilhe", status: "Em breve" },
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
      status: "Disponível",
    },
    {
      title: "Assistente de conteúdo",
      description:
        "Transforme informações básicas em textos comerciais mais claros.",
      icon: Sparkles,
      status: "Disponível",
    },
    {
      title: "Preview ao vivo",
      description: "Revise a proposta com o template e identidade da empresa.",
      icon: Send,
      status: "Disponível",
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
      status: "Disponível",
    },
    {
      name: "Modern",
      audience: "Desenvolvedores e designers",
      status: "Disponível",
    },
    {
      name: "Premium",
      audience: "Agências e projetos de maior valor",
      status: "Disponível",
    },
    {
      name: "Bold",
      audience: "Propostas com visual marcante",
      status: "Disponível",
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
      benefit: "Menos tempo montando, mais tempo fechando.",
      icon: UserRound,
    },
    {
      title: "Desenvolvedores",
      description: "Apresente escopo, prazos e investimento com clareza.",
      benefit: "Escopo e valores sem parecer improviso.",
      icon: Code2,
    },
    {
      title: "Designers",
      description: "Mantenha estética consistente sem refazer layouts do zero.",
      benefit: "Visual alinhado à sua marca em minutos.",
      icon: Palette,
    },
    {
      title: "Agências",
      description:
        "Padronize propostas sem apagar a personalização de cada cliente.",
      benefit: "Processo repetível para cada oportunidade.",
      icon: Building2,
    },
    {
      title: "Consultores",
      description:
        "Organize diagnóstico, solução e próximos passos em um só fluxo.",
      benefit: "Narrativa comercial clara do início ao fechamento.",
      icon: LineChart,
    },
    {
      title: "Social medias",
      description:
        "Monte propostas comerciais mais claras para serviços recorrentes.",
      benefit: "Pacotes e entregáveis fáceis de apresentar.",
      icon: Megaphone,
    },
  ],
  comparison: {
    beforeLabel: "Processo tradicional",
    afterLabel: "Com PropostaAI",
    rows: [
      ["Começar do zero a cada oportunidade", "Reutilizar a base da empresa"],
      ["Ajustar identidade manualmente", "Brand Kit centralizado"],
      ["Informações espalhadas em docs e chats", "Dados comerciais organizados"],
      ["Layout inconsistente entre propostas", "Templates e estruturas controladas"],
      ["Personalização lenta e trabalhosa", "Ajuste por cliente sem refazer tudo"],
    ],
  },
  pricing: [
    {
      name: "Gratuito",
      price: "R$ 0",
      period: "para sempre no lançamento",
      description:
        "Configure sua empresa, crie propostas e valide o produto sem pagar nada.",
      status: "Disponível",
      cta: "Começar gratuitamente",
      highlighted: false,
      items: [
        "Configuração completa da empresa",
        "Brand Kit com cores e templates",
        "Até 3 propostas gratuitas",
        "Editor com preview ao vivo",
        "Assistente de conteúdo com IA",
        "Painel de uso e histórico",
      ],
    },
    {
      name: "Pro",
      price: "R$ 49",
      period: "/mês · cobrança futura",
      description: "Para quem envia propostas toda semana e quer escalar volume.",
      status: "Em breve",
      cta: "Quero ser avisado",
      highlighted: true,
      badge: "Mais popular",
      items: [
        "Até 50 novas propostas por mês",
        "Templates premium",
        "Link público para o cliente",
        "Exportação PDF",
        "Métricas de visualização",
        "Aceite e recusa online",
        "Branding avançado",
        "Suporte prioritário",
      ],
    },
    {
      name: "Estúdio",
      price: "Sob consulta",
      period: "para equipes",
      description:
        "Padronização para agências e times que revisam propostas juntos.",
      status: "Planejado",
      cta: "Criar conta grátis",
      highlighted: false,
      items: [
        "Biblioteca de seções reutilizáveis",
        "Templates por tipo de serviço",
        "Identidade por cliente",
        "Fluxos internos de revisão",
      ],
    },
  ],
  pricingNote:
    "Sem cartão de crédito no cadastro. Você só paga quando os planos pagos forem ativados.",
  faqs: [
    {
      question: "O PropostaAI já está disponível?",
      answer:
        "Sim. Você já pode criar conta, configurar sua empresa, montar propostas com IA, editar conteúdo e visualizar o documento com sua identidade visual. PDF, link público e planos pagos entram na próxima fase.",
    },
    {
      question: "Preciso de cartão de crédito?",
      answer:
        "Não. O cadastro e o plano gratuito não exigem cartão. Você começa, testa e só considera upgrade quando os planos pagos forem liberados.",
    },
    {
      question: "Posso usar a identidade do meu cliente?",
      answer:
        "Hoje você configura a identidade da sua empresa. A adaptação para a marca do cliente está no roadmap e faz parte do plano de personalização avançada.",
    },
    {
      question: "A IA cria o layout inteiro?",
      answer:
        "Não. Templates profissionais definem a estrutura visual. A IA entra para acelerar textos comerciais — escopo, solução, investimento e próximos passos — sem gerar layouts aleatórios.",
    },
    {
      question: "Posso baixar em PDF?",
      answer:
        "Ainda não. O preview ao vivo já está disponível. Exportação PDF entra no plano Pro, junto com link público e métricas.",
    },
    {
      question: "O cliente precisa criar conta?",
      answer:
        "No fluxo atual, você prepara e revisa a proposta no painel. O acesso público sem login do cliente está previsto para a fase de compartilhamento.",
    },
    {
      question: "Para quem o produto é indicado?",
      answer:
        "Prestadores B2B que vendem serviço: freelancers, devs, designers, consultores, social medias e agências que precisam apresentar valor antes de fechar.",
    },
    {
      question: "Existe um plano gratuito?",
      answer:
        "Sim. Você configura sua empresa, usa templates, gera propostas com IA e cria até 3 propostas no plano gratuito.",
    },
  ],
  earlyAccessPrinciples: [
    {
      title: "Simplicidade antes de complexidade",
      description:
        "Fluxo enxuto para ir da configuração à proposta sem curva de aprendizado absurda.",
      icon: Zap,
    },
    {
      title: "Templates controlados",
      description:
        "Layouts profissionais pré-definidos em vez de documentos genéricos ou visuais imprevisíveis.",
      icon: LayoutTemplate,
    },
    {
      title: "Personalização comercial",
      description:
        "Cada cliente recebe contexto, escopo e linguagem adequados — sem recomeçar do zero.",
      icon: Fingerprint,
    },
    {
      title: "IA como copiloto",
      description:
        "Escrita assistida para acelerar, não para substituir seu posicionamento e critério.",
      icon: Sparkles,
    },
  ],
  valueStats: [
    { value: "3", label: "propostas grátis para validar" },
    { value: "4", label: "templates visuais prontos" },
    { value: "1x", label: "base reutilizável da empresa" },
  ],
  finalCta: {
    title: "Sua próxima proposta pode começar com uma base melhor.",
    subtitle:
      "Configure sua empresa uma vez, escolha o template e deixe a IA acelerar o conteúdo. Você revisa, ajusta e envia com aparência profissional.",
    bullets: [
      "Cadastro gratuito, sem cartão",
      "Brand Kit + preview ao vivo",
      "Até 3 propostas para testar na prática",
    ],
  },
  footer: {
    tagline:
      "Propostas comerciais claras, profissionais e personalizadas para quem vende serviços.",
    madeBy: "Um produto Novely",
  },
  decorativeIcons: { CheckCircle2, WandSparkles },
};
