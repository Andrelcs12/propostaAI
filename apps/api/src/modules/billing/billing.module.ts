import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { BillingController } from "./billing.controller";
import { BillingService } from "./billing.service";
import { EntitlementsService } from "./entitlements.service";
import { StripeService } from "./stripe.service";

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule],
  controllers: [BillingController],
  providers: [BillingService, StripeService, EntitlementsService],
  exports: [BillingService, EntitlementsService],
})
export class BillingModule {}
