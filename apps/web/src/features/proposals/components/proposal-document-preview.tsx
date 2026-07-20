"use client";

import type {
  GeneratedProposalContent,
  Proposal,
} from "../types/proposal";
import { ProposalTemplatePreview } from "./proposal-template-preview";

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

  if (!content) {
    return (
      <div className="rounded-md border border-dashed bg-card px-6 py-16 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  const validityLabel = proposal.validityDate
    ? `Valida ate ${new Date(proposal.validityDate).toLocaleDateString("pt-BR")}`
    : null;

  return (
    <ProposalTemplatePreview
      companyName={displayName}
      brand={{
        logoUrl: style.logoUrl ?? sender.logoUrl ?? "",
        lightLogoUrl: "",
        primaryColor: style.primaryColor,
        secondaryColor: style.secondaryColor,
        accentColor: style.accentColor,
        backgroundColor: style.backgroundColor,
        surfaceColor: style.surfaceColor,
        textColor: style.textColor,
        visualPreference: style.visualPreference as "LIGHT" | "DARK" | "AUTO",
        fontPreference: style.fontPreference as
          | "INTER"
          | "MANROPE"
          | "POPPINS"
          | "DM_SANS",
        visualStyle: style.visualStyle as
          | "MINIMAL"
          | "MODERN"
          | "PREMIUM"
          | "BOLD",
        borderRadius: style.borderRadius as "SMALL" | "MEDIUM" | "LARGE",
      }}
      presentationText={sender.presentationText ?? null}
      content={content}
      clientName={proposal.clientName}
      {...(validityLabel ? { validityLabel } : {})}
      paymentConditions={proposal.paymentConditions}
      terms={proposal.terms ?? sender.defaultTerms ?? null}
      footerText={sender.footerText ?? null}
      document={sender.document ?? null}
      address={sender.address ?? null}
      contactText={sender.showContactData ? sender.contactText ?? null : null}
      responsibleName={sender.showSignature ? sender.responsibleName ?? null : null}
      showDetailedValues={sender.showDetailedValues}
    />
  );
}
