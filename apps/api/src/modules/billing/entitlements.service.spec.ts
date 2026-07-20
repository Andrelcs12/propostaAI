import { describe, expect, it, vi, beforeEach } from "vitest";
import { UserPlan } from "../../generated/prisma/enums";
import { EntitlementsService } from "./entitlements.service";

describe("EntitlementsService", () => {
  const prisma = {
    user: {
      findUniqueOrThrow: vi.fn(),
    },
    proposal: {
      count: vi.fn(),
    },
    $transaction: vi.fn(async (callback: (tx: unknown) => Promise<void>) =>
      callback({
        proposal: {
          findUnique: vi.fn(),
          update: vi.fn(),
          count: vi.fn(),
        },
        user: {
          findUniqueOrThrow: vi.fn(),
        },
      }),
    ),
  };

  const service = new EntitlementsService(prisma as never);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("allows free user with 0/3 to generate", async () => {
    prisma.user.findUniqueOrThrow.mockResolvedValue({
      id: "u1",
      plan: UserPlan.FREE,
      subscriptionStatus: null,
      subscriptionCurrentPeriodEnd: null,
      subscriptionCancelAtPeriodEnd: false,
    });
    prisma.proposal.count.mockResolvedValue(0);

    const result = await service.getEntitlements("u1");
    expect(result.canCreateProposal).toBe(true);
    expect(result.usage).toBe(0);
    expect(result.limit).toBe(3);
  });

  it("blocks free user with 3/3", async () => {
    prisma.user.findUniqueOrThrow.mockResolvedValue({
      id: "u1",
      plan: UserPlan.FREE,
      subscriptionStatus: null,
      subscriptionCurrentPeriodEnd: null,
      subscriptionCancelAtPeriodEnd: false,
    });
    prisma.proposal.count.mockResolvedValue(3);

    const result = await service.getEntitlements("u1");
    expect(result.canCreateProposal).toBe(false);
  });

  it("allows active pro user", async () => {
    prisma.user.findUniqueOrThrow.mockResolvedValue({
      id: "u1",
      plan: UserPlan.PRO,
      subscriptionStatus: "active",
      subscriptionCurrentPeriodEnd: new Date(Date.now() + 86400000),
      subscriptionCancelAtPeriodEnd: false,
    });
    prisma.proposal.count.mockResolvedValue(10);

    const result = await service.getEntitlements("u1");
    expect(result.plan).toBe("PRO");
    expect(result.canCreateProposal).toBe(true);
    expect(result.limit).toBeNull();
  });
});
