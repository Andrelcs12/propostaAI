import type { GeneratedProposalContent } from "@/features/proposals/types/proposal";

export type CommercialSectionId =
  | "header"
  | "introduction"
  | "clientContext"
  | "problem"
  | "proposedSolution"
  | "scope"
  | "deliverables"
  | "timeline"
  | "investment"
  | "payment"
  | "differentials"
  | "nextSteps"
  | "closing"
  | "terms"
  | "contact";

export type CommercialSection = {
  id: CommercialSectionId;
  title: string;
  description: string;
  aiField?: keyof GeneratedProposalContent | "paymentConditions" | "terms";
};

export const COMMERCIAL_PROPOSAL_SECTIONS: CommercialSection[] = [
  {
    id: "header",
    title: "Cabecalho",
    description: "Empresa, cliente, data e validade da proposta.",
  },
  {
    id: "introduction",
    title: "Introducao",
    description: "Resumo executivo e objetivo da proposta.",
    aiField: "introduction",
  },
  {
    id: "clientContext",
    title: "Contexto do cliente",
    description: "Entendimento do negocio, momento e necessidade.",
    aiField: "clientContext",
  },
  {
    id: "problem",
    title: "Desafio identificado",
    description: "Problema ou oportunidade que a proposta resolve.",
    aiField: "problem",
  },
  {
    id: "proposedSolution",
    title: "Solucao proposta",
    description: "Abordagem recomendada e valor entregue.",
    aiField: "proposedSolution",
  },
  {
    id: "scope",
    title: "Escopo do projeto",
    description: "O que esta incluso e o que fica fora.",
    aiField: "scope",
  },
  {
    id: "deliverables",
    title: "Entregaveis",
    description: "Lista clara do que o cliente recebe.",
    aiField: "deliverables",
  },
  {
    id: "timeline",
    title: "Cronograma",
    description: "Etapas, prazos e marcos do projeto.",
    aiField: "timeline",
  },
  {
    id: "investment",
    title: "Investimento",
    description: "Valores, pacotes ou faixas de precificacao.",
    aiField: "investment",
  },
  {
    id: "payment",
    title: "Condicoes de pagamento",
    description: "Forma de cobranca, parcelas e regras comerciais.",
    aiField: "paymentConditions",
  },
  {
    id: "differentials",
    title: "Diferenciais",
    description: "Por que contratar voce e nao outra opcao.",
    aiField: "differentials",
  },
  {
    id: "nextSteps",
    title: "Proximos passos",
    description: "Como avancar apos a leitura da proposta.",
    aiField: "nextSteps",
  },
  {
    id: "closing",
    title: "Encerramento",
    description: "Mensagem final de fechamento comercial.",
    aiField: "closing",
  },
  {
    id: "terms",
    title: "Termos e observacoes",
    description: "Regras, limites, revisoes e observacoes legais.",
    aiField: "terms",
  },
  {
    id: "contact",
    title: "Contato e assinatura",
    description: "Dados para resposta e responsavel comercial.",
  },
];

export const DEMO_PROPOSAL_CONTENT: GeneratedProposalContent = {
  title: "Proposta comercial — Identidade digital e presenca online",
  introduction:
    "Obrigado pela oportunidade. Esta proposta apresenta uma solucao completa para fortalecer a presenca digital da sua empresa, com escopo claro, prazos definidos e investimento transparente.",
  clientContext:
    "A empresa busca profissionalizar sua comunicacao visual e converter melhor o interesse de novos clientes em oportunidades comerciais.",
  problem:
    "Hoje a apresentacao comercial nao reflete o nivel do servico entregue, o que reduz percepcao de valor e dificulta fechamentos mais rapidos.",
  proposedSolution:
    "Vamos estruturar uma identidade visual consistente, landing page objetiva e materiais comerciais alinhados ao posicionamento da marca.",
  scope: [
    {
      id: "s1",
      title: "Diagnostico e direcionamento",
      description: "Alinhamento de objetivos, publico e referencias visuais.",
    },
    {
      id: "s2",
      title: "Identidade e aplicacoes",
      description: "Logo, cores, tipografia e kit basico para propostas.",
    },
    {
      id: "s3",
      title: "Pagina de conversao",
      description: "Landing responsiva com foco em captacao de leads.",
    },
  ],
  deliverables: [
    {
      id: "d1",
      title: "Brand kit em PDF e arquivos editaveis",
      description: "Manual resumido + arquivos para uso comercial.",
    },
    {
      id: "d2",
      title: "Landing page publicada",
      description: "Versao responsiva pronta para divulgacao.",
    },
    {
      id: "d3",
      title: "Modelo de proposta comercial",
      description: "Base reutilizavel para novas oportunidades.",
    },
  ],
  timeline: [
    {
      id: "t1",
      title: "Kickoff e briefing",
      duration: "Semana 1",
      description: "Levantamento de requisitos e aprovacao da direcao.",
    },
    {
      id: "t2",
      title: "Design e desenvolvimento",
      duration: "Semanas 2-4",
      description: "Criacao visual, revisoes e implementacao.",
    },
    {
      id: "t3",
      title: "Entrega e ajustes finais",
      duration: "Semana 5",
      description: "Publicacao, handoff e suporte inicial.",
    },
  ],
  investment: [
    {
      id: "i1",
      label: "Pacote completo",
      amount: 12500,
      description: "Identidade, landing e materiais comerciais.",
    },
  ],
  differentials: [
    "Processo claro do briefing a entrega",
    "Comunicacao objetiva em todas as etapas",
    "Material reutilizavel para novas vendas",
  ],
  nextSteps:
    "Se fizer sentido para voce, responda esta proposta com aprovacao ou duvidas. Agendamos o kickoff em ate 5 dias uteis apos confirmacao.",
  closing:
    "Fico a disposicao para ajustar escopo, prazo ou investimento conforme a prioridade do projeto.",
};

export const DEMO_CLIENT_NAME = "Cliente Exemplo Ltda.";
export const DEMO_VALIDITY_LABEL = "Valida por 15 dias";
