import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { UsersService } from "../users/users.service";
import { AnalyzeCompanyDto, SearchCompanyDto } from "./dto/search-company.dto";
import { CompanyResearchService } from "./company-research.service";

@ApiTags("company-research")
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller("company-research")
export class CompanyResearchController {
  constructor(
    private readonly companyResearchService: CompanyResearchService,
    private readonly usersService: UsersService,
  ) {}

  @Post("search")
  @ApiOkResponse({ description: "Busca candidatos de empresas" })
  async search(
    @CurrentUser() authUser: SupabaseUser,
    @Body() dto: SearchCompanyDto,
  ) {
    const user = await this.usersService.findOrSyncFromSupabase(authUser);
    return this.companyResearchService.searchCompanies(user.id, dto);
  }

  @Post("analyze")
  @ApiOkResponse({ description: "Analisa empresa confirmada" })
  async analyze(
    @CurrentUser() authUser: SupabaseUser,
    @Body() dto: AnalyzeCompanyDto,
  ) {
    const user = await this.usersService.findOrSyncFromSupabase(authUser);
    return this.companyResearchService.analyzeCompany(user.id, dto);
  }
}
