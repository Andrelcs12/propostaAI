import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

@Injectable()
export class StripeService {
  private readonly stripe: Stripe | null;

  constructor(configService: ConfigService) {
    const secretKey = configService.get<string>("STRIPE_SECRET_KEY");

    // Conectar futuras operacoes reais do Stripe aqui quando billing for ativado.
    this.stripe = secretKey
      ? new Stripe(secretKey, { apiVersion: "2025-08-27.basil" })
      : null;
  }

  getClient() {
    return this.stripe;
  }
}
