import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { fetchPublicProposal } from "@/lib/api/public-proposal";
import { ProposalPublicView } from "@/features/proposals/components/proposal-public-view";

export const dynamic = "force-dynamic";

type PublicProposalPageProps = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ print?: string }>;
};

export default async function PublicProposalPage({
  params,
  searchParams,
}: PublicProposalPageProps) {
  const { token } = await params;
  const { print } = await searchParams;
  const printMode = print === "1";

  try {
    const proposal = await fetchPublicProposal(token, { print: printMode });

    return <ProposalPublicView proposal={proposal} token={token} printMode={printMode} />;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
