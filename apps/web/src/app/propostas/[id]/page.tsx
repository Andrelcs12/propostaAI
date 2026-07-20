import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api/client";
import { getCurrentProfile } from "@/features/auth/services/profile.service";
import { ProposalEditor } from "@/features/proposals/components/proposal-editor";
import { getProposal } from "@/features/proposals/services/proposal.service";
import { requireOnboardingStatus } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

type ProposalDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProposalDetailPage({
  params,
}: ProposalDetailPageProps) {
  const { id } = await params;
  const { accessToken, companyStatus } = await requireOnboardingStatus();

  if (!companyStatus.onboardingDone) {
    redirect("/onboarding");
  }

  const profile = await getCurrentProfile(accessToken);

  try {
    const proposal = await getProposal(accessToken, id);

    return (
      <AppShell profile={profile}>
        <div className="mb-6">
          <Button asChild variant="outline">
            <Link href="/propostas">Voltar para propostas</Link>
          </Button>
        </div>
        <ProposalEditor initialProposal={proposal} />
      </AppShell>
    );
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }
}
