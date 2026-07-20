import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { BillingModule } from "../billing/billing.module";
import { UsersModule } from "../users/users.module";
import { GeminiService } from "./gemini.service";
import { ProposalPdfService } from "./proposal-pdf.service";
import { ProposalReferenceService } from "./proposal-reference.service";
import { PublicProposalsController } from "./public-proposals.controller";
import { ProposalsController } from "./proposals.controller";
import { ProposalsService } from "./proposals.service";

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, BillingModule],
  controllers: [PublicProposalsController, ProposalsController],
  providers: [
    ProposalsService,
    GeminiService,
    ProposalPdfService,
    ProposalReferenceService,
  ],
  exports: [GeminiService, ProposalReferenceService],
})
export class ProposalsModule {}
