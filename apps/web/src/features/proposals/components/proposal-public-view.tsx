"use client";



import { useState } from "react";

import type { PublicProposal, ProposalStatus } from "../types/proposal";

import { ProposalTemplatePreview } from "./proposal-template-preview";

import { PublicProposalActions } from "./public-proposal-actions";



type ProposalPublicViewProps = {

  proposal: PublicProposal;

  token: string;

  printMode?: boolean;

};



export function ProposalPublicView({

  proposal: initialProposal,

  token,

  printMode = false,

}: ProposalPublicViewProps) {

  const [status, setStatus] = useState<ProposalStatus>(initialProposal.status);

  const sender = initialProposal.senderSnapshot;

  const style = initialProposal.styleSnapshot;

  const content = initialProposal.generatedContent;

  const displayName = sender.displayName || sender.name;



  const validityLabel = initialProposal.validityDate
    ? `Valida ate ${new Date(initialProposal.validityDate).toLocaleDateString("pt-BR")}`
    : null;



  return (

    <div

      className={

        printMode ? "proposal-print-root bg-white" : "min-h-screen bg-muted/30 py-8"

      }

      data-proposal-document={printMode ? "ready" : undefined}

    >

      <div className={printMode ? "mx-auto max-w-[820px]" : "mx-auto max-w-3xl px-4"}>

        {!printMode ? (

          <>

            <div className="mb-6 rounded-xl border bg-background/90 px-4 py-3 text-sm text-muted-foreground backdrop-blur">

              Proposta comercial preparada para{" "}

              <span className="font-medium text-foreground">

                {initialProposal.clientName}

              </span>

              {initialProposal.clientContactName ? (

                <> · {initialProposal.clientContactName}</>

              ) : null}

            </div>

            <PublicProposalActions

              token={token}

              status={status}

              onUpdated={setStatus}

            />

          </>

        ) : null}



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

          clientName={initialProposal.clientName}

          {...(validityLabel ? { validityLabel } : {})}

          paymentConditions={initialProposal.paymentConditions}

          terms={initialProposal.terms ?? sender.defaultTerms ?? null}

          footerText={sender.footerText ?? null}

          document={sender.document ?? null}

          address={sender.address ?? null}

          contactText={sender.showContactData ? sender.contactText ?? null : null}

          responsibleName={sender.showSignature ? sender.responsibleName ?? null : null}

          showDetailedValues={sender.showDetailedValues}

          printMode={printMode}

        />

      </div>

    </div>

  );

}


