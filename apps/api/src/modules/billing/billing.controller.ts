import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { BillingService } from "./billing.service";

@ApiTags("billing")
@Controller("billing")
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get("config")
  @ApiOkResponse({ description: "Configuracao publica do Stripe no template" })
  getConfig() {
    return this.billingService.getConfig();
  }
}
