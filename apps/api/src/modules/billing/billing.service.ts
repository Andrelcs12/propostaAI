import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Stripe from "stripe";
import { UserPlan } from "../../generated/prisma/enums";
import { PrismaService } from "../../database/prisma.service";
import { UsersService } from "../users/users.service";
import { FREE_PROPOSAL_LIMIT } from "./billing.constants";
import { EntitlementsService } from "./entitlements.service";
import { StripeService } from "./stripe.service";

@Injectable()
export class BillingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly stripeService: StripeService,
    private readonly entitlementsService: EntitlementsService,
    private readonly configService: ConfigService,
  ) {}

  getConfig() {
    const priceInCents = Number(
      this.configService.get<string>("PROPOSAL_PRICE_IN_CENTS") ?? 4900,
    );

    return {
      enabled: this.stripeService.isConfigured(),
      mode: this.stripeService.isConfigured()
        ? ("live" as const)
        : ("structure-only" as const),
      freeProposalLimit: FREE_PROPOSAL_LIMIT,
      priceInCents,
      priceLabel: "R$ 49/mês",
    };
  }

  async getUsage(authUser: SupabaseUser) {
    const user = await this.usersService.findOrSyncFromSupabase(authUser);
    const entitlements = await this.entitlementsService.getEntitlements(
      user.id,
    );

    const statusCounts = await this.prisma.proposal.groupBy({
      by: ["status"],
      where: { userId: user.id },
      _count: { status: true },
    });

    return {
      plan: entitlements.plan.toLowerCase() as "free" | "pro",
      proposalsUsed: entitlements.usage,
      proposalsLimit: entitlements.limit ?? null,
      proposalsRemaining:
        entitlements.limit === null
          ? null
          : Math.max(0, entitlements.limit - entitlements.usage),
      canCreateProposal: entitlements.canCreateProposal,
      aiConfigured: Boolean(this.configService.get("GEMINI_API_KEY")?.trim()),
      subscriptionStatus: entitlements.subscriptionStatus ?? undefined,
      currentPeriodEnd: entitlements.currentPeriodEnd ?? undefined,
      cancelAtPeriodEnd: entitlements.cancelAtPeriodEnd ?? false,
      reason: entitlements.reason,
      byStatus: Object.fromEntries(
        statusCounts.map((item) => [item.status, item._count.status]),
      ),
    };
  }

  async getStatus(authUser: SupabaseUser) {
    const usage = await this.getUsage(authUser);
    return {
      plan: usage.plan.toUpperCase() as "FREE" | "PRO",
      subscriptionStatus: usage.subscriptionStatus,
      usage: usage.proposalsUsed,
      limit: usage.proposalsLimit,
      currentPeriodEnd: usage.currentPeriodEnd,
      cancelAtPeriodEnd: usage.cancelAtPeriodEnd,
    };
  }

  async createCheckout(authUser: SupabaseUser) {
    const stripe = this.requireStripe();
    const priceId = this.stripeService.getPriceId();

    if (!priceId) {
      throw new ServiceUnavailableException(
        "Plano Pro nao configurado. Defina STRIPE_PRICE_PRO_MONTHLY_ID.",
      );
    }

    const publicUser = await this.usersService.findOrSyncFromSupabase(authUser);
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: publicUser.id },
    });

    if (this.entitlementsService.hasActiveProAccess(user)) {
      return this.createPortal(authUser);
    }

    const customerId = await this.ensureStripeCustomer(user.id, user.email, user.name);

    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        customer: customerId,
        client_reference_id: user.id,
        line_items: [{ price: priceId, quantity: 1 }],
        allow_promotion_codes: true,
        success_url: `${this.getWebUrl()}/billing/sucesso?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${this.getWebUrl()}/configuracoes?checkout=canceled`,
        subscription_data: {
          metadata: { userId: user.id },
        },
        metadata: { userId: user.id },
      },
      {
        idempotencyKey: `propostaai-checkout-${user.id}-${priceId}`,
      },
    );

    if (!session.url) {
      throw new ServiceUnavailableException(
        "Nao foi possivel iniciar o checkout.",
      );
    }

    return { url: session.url };
  }

  async createPortal(authUser: SupabaseUser) {
    const stripe = this.requireStripe();
    const publicUser = await this.usersService.findOrSyncFromSupabase(authUser);
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: publicUser.id },
    });

    if (!user.stripeCustomerId) {
      throw new BadRequestException(
        "Nenhuma assinatura encontrada para gerenciar.",
      );
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${this.getWebUrl()}/configuracoes`,
    });

    return { url: session.url };
  }

  async handleWebhook(rawBody: Buffer, signature: string | undefined) {
    const stripe = this.requireStripe();
    const webhookSecret = this.stripeService.getWebhookSecret();

    if (!webhookSecret) {
      throw new ServiceUnavailableException("Webhook nao configurado.");
    }

    if (!signature) {
      throw new BadRequestException("Assinatura Stripe ausente.");
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch {
      throw new BadRequestException("Assinatura Stripe invalida.");
    }

    const existing = await this.prisma.stripeWebhookEvent.findUnique({
      where: { stripeEventId: event.id },
    });

    if (existing) {
      return { received: true, duplicate: true };
    }

    await this.prisma.stripeWebhookEvent.create({
      data: {
        stripeEventId: event.id,
        type: event.type,
      },
    });

    switch (event.type) {
      case "checkout.session.completed":
        await this.handleCheckoutCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await this.syncSubscription(event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await this.handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription,
        );
        break;
      case "invoice.paid":
        await this.syncSubscriptionFromInvoice(
          event.data.object as Stripe.Invoice,
        );
        break;
      case "invoice.payment_failed":
        await this.syncSubscriptionFromInvoice(
          event.data.object as Stripe.Invoice,
        );
        break;
      default:
        break;
    }

    return { received: true };
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId ?? session.client_reference_id;
    if (!userId || !session.customer) return;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId: String(session.customer),
      },
    });

    if (session.subscription) {
      const stripe = this.requireStripe();
      const subscription = await stripe.subscriptions.retrieve(
        String(session.subscription),
      );
      await this.syncSubscription(subscription, userId);
    }
  }

  private async syncSubscriptionFromInvoice(invoice: Stripe.Invoice) {
    const subscriptionRef = (invoice as Stripe.Invoice & {
      subscription?: string | Stripe.Subscription | null;
    }).subscription;
    const subscriptionId =
      typeof subscriptionRef === "string"
        ? subscriptionRef
        : subscriptionRef?.id;

    if (!subscriptionId) return;

    const stripe = this.requireStripe();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    await this.syncSubscription(subscription);
  }

  private async syncSubscription(
    subscription: Stripe.Subscription,
    fallbackUserId?: string,
  ) {
    const userId =
      subscription.metadata.userId ??
      fallbackUserId ??
      (await this.findUserIdByCustomer(String(subscription.customer)));

    if (!userId) return;

    const priceId = subscription.items.data[0]?.price.id ?? null;
    const periodEnd = (subscription as Stripe.Subscription & {
      current_period_end?: number;
    }).current_period_end;
    const currentPeriodEnd = periodEnd
      ? new Date(periodEnd * 1000)
      : null;

    const isActive = ["active", "trialing"].includes(subscription.status);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        stripeCustomerId: String(subscription.customer),
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        subscriptionStatus: subscription.status,
        subscriptionCurrentPeriodEnd: currentPeriodEnd,
        subscriptionCancelAtPeriodEnd: subscription.cancel_at_period_end,
        plan: isActive ? UserPlan.PRO : UserPlan.FREE,
      },
    });
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const userId = await this.findUserIdByCustomer(String(subscription.customer));
    if (!userId) return;

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        stripeSubscriptionId: null,
        stripePriceId: null,
        subscriptionStatus: subscription.status,
        subscriptionCurrentPeriodEnd: (() => {
          const periodEnd = (subscription as Stripe.Subscription & {
            current_period_end?: number;
          }).current_period_end;
          return periodEnd ? new Date(periodEnd * 1000) : null;
        })(),
        subscriptionCancelAtPeriodEnd: false,
        plan: UserPlan.FREE,
      },
    });
  }

  private async findUserIdByCustomer(customerId: string) {
    const user = await this.prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
      select: { id: true },
    });
    return user?.id;
  }

  private async ensureStripeCustomer(
    userId: string,
    email: string,
    name: string,
  ) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    if (user.stripeCustomerId) {
      return user.stripeCustomerId;
    }

    const stripe = this.requireStripe();
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: { userId },
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customer.id },
    });

    return customer.id;
  }

  private requireStripe() {
    const stripe = this.stripeService.getClient();
    if (!stripe) {
      throw new ServiceUnavailableException("Stripe nao configurado.");
    }
    return stripe;
  }

  private getWebUrl() {
    return this.configService.get<string>("WEB_URL")?.trim() || "http://localhost:3000";
  }
}
