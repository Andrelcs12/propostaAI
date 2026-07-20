import { Module } from "@nestjs/common";
import { GeminiService } from "./gemini.service";
import { ProposalsController } from "./proposals.controller";
import { ProposalsService } from "./proposals.service";

@Module({
  controllers: [ProposalsController],
  providers: [ProposalsService, GeminiService],
})
export class ProposalsModule {}
