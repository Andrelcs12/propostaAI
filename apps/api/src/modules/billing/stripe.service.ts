import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

@Injectable()
export class StripeService {
  private readonly stripe: Stripe | null;
  private readonly apiVersion: Stripe.LatestApiVersion;

  constructor(private readonly configService: ConfigService) {
    const secretKey = configService.get<string>("STRIPE_SECRET_KEY")?.trim();
    const configuredVersion =
      configService.get<string>("STRIPE_API_VERSION")?.trim() ||
      "2025-08-27.basil";

    this.apiVersion = configuredVersion as Stripe.LatestApiVersion;
    this.stripe = secretKey
      ? new Stripe(secretKey, { apiVersion: this.apiVersion })
      : null;
  }

  isConfigured() {
    return Boolean(this.stripe);
  }

  getClient() {
    return this.stripe;
  }

  getPriceId() {
    return this.configService.get<string>("STRIPE_PRICE_PRO_MONTHLY_ID")?.trim();
  }

  getWebhookSecret() {
    return this.configService.get<string>("STRIPE_WEBHOOK_SECRET")?.trim();
  }
}
