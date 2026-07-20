"use client";

import type {
  GeneratedProposalContent,
  Proposal,
} from "../types/proposal";
import { getRadiusValue, getReadableTextColor } from "@/features/company/utils/brand";

type ProposalDocumentPreviewProps = {
  proposal: Proposal;
  content?: GeneratedProposalContent | null;
  emptyMessage?: string;
};

export function ProposalDocumentPreview({
  proposal,
  content,
  emptyMessage = "O preview aparecera aqui apos a geracao ou edicao do conteudo.",
}: ProposalDocumentPreviewProps) {
  const sender = proposal.senderSnapshot;
  const style = proposal.styleSnapshot;
  const displayName = sender.displayName || sender.name;
  const buttonTextColor = getReadableTextColor(style.primaryColor);

  if (!content) {
    return (
      <div className="rounded-md border border-dashed bg-card px-6 py-16 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className="overflow-hidden border shadow-sm"
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        borderRadius: getRadiusValue(style.borderRadius),
      }}
    >
      <div className="border-b px-6 py-5" style={{ borderColor: style.secondaryColor }}>
        <div className="flex items-center gap-3">
          {style.logoUrl ? (
            <img
              src={style.logoUrl}
              alt={displayName}
              className="size-12 rounded-md object-cover"
            />
          ) : (
            <div
              className="flex size-12 items-center justify-center font-semibold"
              style={{
                backgroundColor: style.primaryColor,
                color: buttonTextColor,
                borderRadius: getRadiusValue(style.borderRadius),
              }}
            >
              {displayName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-lg font-semibold">{displayName}</p>
            {sender.presentationText ? (
              <p className="text-sm opacity-75">{sender.presentationText}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-6 px-6 py-6">
        <Section title="Cliente" accent={style.accentColor}>
          <p className="font-medium">{proposal.clientName}</p>
          {proposal.clientContactName ? (
            <p className="text-sm opacity-75">{proposal.clientContactName}</p>
          ) : null}
        </Section>

        <Section title={content.title} accent={style.accentColor}>
          <p>{content.introduction}</p>
        </Section>

        {content.clientContext ? (
          <Section title="Contexto do cliente" accent={style.accentColor}>
            <p>{content.clientContext}</p>
          </Section>
        ) : null}

        {content.problem ? (
          <Section title="Problema identificado" accent={style.accentColor}>
            <p>{content.problem}</p>
          </Section>
        ) : null}

        {content.proposedSolution ? (
          <Section title="Solucao proposta" accent={style.accentColor}>
            <p>{content.proposedSolution}</p>
          </Section>
        ) : null}

        {content.scope.length > 0 ? (
          <Section title="Escopo" accent={style.accentColor}>
            <ul className="space-y-3">
              {content.scope.map((item) => (
                <li key={item.id}>
                  <p className="font-medium">{item.title}</p>
                  {item.description ? (
                    <p className="text-sm opacity-75">{item.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {content.deliverables.length > 0 ? (
          <Section title="Entregaveis" accent={style.accentColor}>
            <ul className="space-y-3">
              {content.deliverables.map((item) => (
                <li key={item.id}>
                  <p className="font-medium">{item.title}</p>
                  {item.description ? (
                    <p className="text-sm opacity-75">{item.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {content.timeline.length > 0 ? (
          <Section title="Cronograma" accent={style.accentColor}>
            <ul className="space-y-3">
              {content.timeline.map((item) => (
                <li key={item.id}>
                  <p className="font-medium">
                    {item.title}
                    {item.duration ? ` — ${item.duration}` : ""}
                  </p>
                  {item.description ? (
                    <p className="text-sm opacity-75">{item.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {content.investment.length > 0 && sender.showDetailedValues ? (
          <Section title="Investimento" accent={style.accentColor}>
            <ul className="space-y-3">
              {content.investment.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-4"
                >
                  <div>
                    <p className="font-medium">{item.label}</p>
                    {item.description ? (
                      <p className="text-sm opacity-75">{item.description}</p>
                    ) : null}
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(item.amount)}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {proposal.paymentConditions ? (
          <Section title="Condicoes de pagamento" accent={style.accentColor}>
            <p>{proposal.paymentConditions}</p>
          </Section>
        ) : null}

        {content.differentials.length > 0 ? (
          <Section title="Diferenciais" accent={style.accentColor}>
            <ul className="list-disc space-y-2 pl-5">
              {content.differentials.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Section>
        ) : null}

        {content.nextSteps ? (
          <Section title="Proximos passos" accent={style.accentColor}>
            <p>{content.nextSteps}</p>
          </Section>
        ) : null}

        {content.closing ? (
          <Section title="Encerramento" accent={style.accentColor}>
            <p>{content.closing}</p>
          </Section>
        ) : null}

        {proposal.terms || sender.defaultTerms ? (
          <Section title="Termos e observacoes" accent={style.accentColor}>
            <p>{proposal.terms || sender.defaultTerms}</p>
          </Section>
        ) : null}

        {sender.showContactData && sender.contactText ? (
          <Section title="Contato" accent={style.accentColor}>
            <p className="whitespace-pre-line">{sender.contactText}</p>
          </Section>
        ) : null}

        {sender.showSignature && sender.responsibleName ? (
          <div className="border-t pt-6" style={{ borderColor: style.secondaryColor }}>
            <p className="font-medium">{sender.responsibleName}</p>
            {sender.responsibleRole ? (
              <p className="text-sm opacity-75">{sender.responsibleRole}</p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Section({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3
        className="mb-2 text-sm font-semibold uppercase tracking-wide"
        style={{ color: accent }}
      >
        {title}
      </h3>
      <div className="text-sm leading-6">{children}</div>
    </section>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
