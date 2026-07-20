import {
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { UserPlan } from "../../generated/prisma/enums";
import { PrismaService } from "../../database/prisma.service";
import { FREE_PROPOSAL_LIMIT } from "./billing.constants";

export type Entitlements = {
  canCreateProposal: boolean;
  plan: "FREE" | "PRO";
  usage: number;
  limit: number | null;
  reason?: string;
  subscriptionStatus?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
};

const ACTIVE_SUBSCRIPTION_STATUSES = new Set(["active", "trialing"]);

@Injectable()
export class EntitlementsService {
  constructor(private readonly prisma: PrismaService) {}

  hasActiveProAccess(user: {
    plan: UserPlan;
    subscriptionStatus: string | null;
    subscriptionCurrentPeriodEnd: Date | null;
    subscriptionCancelAtPeriodEnd: boolean;
  }) {
    if (user.plan !== UserPlan.PRO) {
      return false;
    }

    if (
      user.subscriptionStatus &&
      ACTIVE_SUBSCRIPTION_STATUSES.has(user.subscriptionStatus)
    ) {
      return true;
    }

    if (
      user.subscriptionCancelAtPeriodEnd &&
      user.subscriptionCurrentPeriodEnd &&
      user.subscriptionCurrentPeriodEnd.getTime() > Date.now()
    ) {
      return true;
    }

    return false;
  }

  async getEntitlements(userId: string): Promise<Entitlements> {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    const usage = await this.prisma.proposal.count({
      where: { userId, quotaConsumedAt: { not: null } },
    });

    const isPro = this.hasActiveProAccess(user);

    if (isPro) {
      return {
        canCreateProposal: true,
        plan: "PRO",
        usage,
        limit: null,
        subscriptionStatus: user.subscriptionStatus,
        currentPeriodEnd: user.subscriptionCurrentPeriodEnd?.toISOString() ?? null,
        cancelAtPeriodEnd: user.subscriptionCancelAtPeriodEnd,
      };
    }

    const canCreateProposal = usage < FREE_PROPOSAL_LIMIT;

    return {
      canCreateProposal,
      plan: "FREE",
      usage,
      limit: FREE_PROPOSAL_LIMIT,
      reason: canCreateProposal
        ? undefined
        : "Voce utilizou suas propostas gratuitas. Assine o plano Pro para continuar.",
      subscriptionStatus: user.subscriptionStatus,
      currentPeriodEnd: user.subscriptionCurrentPeriodEnd?.toISOString() ?? null,
      cancelAtPeriodEnd: user.subscriptionCancelAtPeriodEnd,
    };
  }

  async assertCanGenerate(userId: string, quotaConsumedAt: Date | null) {
    if (quotaConsumedAt) {
      return;
    }

    const entitlements = await this.getEntitlements(userId);

    if (!entitlements.canCreateProposal) {
      throw new ForbiddenException(
        entitlements.reason ??
          "Limite do plano gratuito atingido. Assine o plano Pro para continuar.",
      );
    }
  }

  async consumeQuotaIfNeeded(userId: string, proposalId: string) {
    await this.prisma.$transaction(async (tx) => {
      const proposal = await tx.proposal.findUnique({
        where: { id: proposalId },
        select: { userId: true, quotaConsumedAt: true },
      });

      if (!proposal || proposal.userId !== userId || proposal.quotaConsumedAt) {
        return;
      }

      const user = await tx.user.findUniqueOrThrow({
        where: { id: userId },
      });

      if (this.hasActiveProAccess(user)) {
        await tx.proposal.update({
          where: { id: proposalId },
          data: { quotaConsumedAt: new Date() },
        });
        return;
      }

      const usage = await tx.proposal.count({
        where: { userId, quotaConsumedAt: { not: null } },
      });

      if (usage >= FREE_PROPOSAL_LIMIT) {
        throw new ForbiddenException(
          "Limite do plano gratuito atingido. Assine o plano Pro para continuar.",
        );
      }

      await tx.proposal.update({
        where: { id: proposalId },
        data: { quotaConsumedAt: new Date() },
      });
    });
  }
}
