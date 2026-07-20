import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ProposalsModule } from "../proposals/proposals.module";
import { UsersModule } from "../users/users.module";
import { CompanyResearchController } from "./company-research.controller";
import { CompanyResearchService } from "./company-research.service";

@Module({
  imports: [AuthModule, UsersModule, ProposalsModule],
  controllers: [CompanyResearchController],
  providers: [CompanyResearchService],
})
export class CompanyResearchModule {}
