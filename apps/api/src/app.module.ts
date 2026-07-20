import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { BillingModule } from "./modules/billing/billing.module";
import { CompanyModule } from "./modules/company/company.module";
import { CompanyResearchModule } from "./modules/company-research/company-research.module";
import { HealthModule } from "./modules/health/health.module";
import { ProposalsModule } from "./modules/proposals/proposals.module";
import { UsersModule } from "./modules/users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", "../../.env"],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CompanyModule,
    ProposalsModule,
    BillingModule,
    CompanyResearchModule,
    HealthModule,
  ],
})
export class AppModule {}
