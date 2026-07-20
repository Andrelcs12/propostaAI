import {
  Controller,
  Get,
  Headers,
  Post,
  RawBodyRequest,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { FastifyRequest } from "fastify";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { BillingService } from "./billing.service";

@ApiTags("billing")
@Controller("billing")
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get("config")
  @ApiOkResponse({ description: "Configuracao publica do billing" })
  getConfig() {
    return this.billingService.getConfig();
  }

  @Get("usage")
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Uso do plano e limites da conta" })
  getUsage(@CurrentUser() authUser: SupabaseUser) {
    return this.billingService.getUsage(authUser);
  }

  @Get("status")
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Status da assinatura" })
  getStatus(@CurrentUser() authUser: SupabaseUser) {
    return this.billingService.getStatus(authUser);
  }

  @Post("checkout")
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Cria sessao de checkout Stripe" })
  createCheckout(@CurrentUser() authUser: SupabaseUser) {
    return this.billingService.createCheckout(authUser);
  }

  @Post("portal")
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Cria sessao do Customer Portal" })
  createPortal(@CurrentUser() authUser: SupabaseUser) {
    return this.billingService.createPortal(authUser);
  }

  @Post("webhook")
  @ApiOkResponse({ description: "Webhook Stripe" })
  webhook(
    @Req() request: RawBodyRequest<FastifyRequest>,
    @Headers("stripe-signature") signature: string | undefined,
  ) {
    const rawBody = request.rawBody;

    if (!rawBody) {
      throw new Error("Raw body ausente para webhook Stripe.");
    }

    return this.billingService.handleWebhook(rawBody, signature);
  }
}
