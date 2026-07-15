import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { CompanyService } from "./company.service";
import { UpdateCompanyBasicDto } from "./dto/update-company-basic.dto";
import { UpdateCompanyBrandDto } from "./dto/update-company-brand.dto";
import { UpdateCompanyCommercialDto } from "./dto/update-company-commercial.dto";

@ApiTags("company")
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get("me")
  @ApiOkResponse({ description: "Empresa do usuario autenticado" })
  getMe(@CurrentUser() authUser: SupabaseUser) {
    return this.companyService.getMyCompany(authUser);
  }

  @Patch("me/basic")
  @ApiOkResponse({ description: "Atualiza dados basicos da empresa" })
  updateBasic(
    @CurrentUser() authUser: SupabaseUser,
    @Body() dto: UpdateCompanyBasicDto,
  ) {
    return this.companyService.updateBasic(authUser, dto);
  }

  @Patch("me/brand")
  @ApiOkResponse({ description: "Atualiza identidade visual da empresa" })
  updateBrand(
    @CurrentUser() authUser: SupabaseUser,
    @Body() dto: UpdateCompanyBrandDto,
  ) {
    return this.companyService.updateBrand(authUser, dto);
  }

  @Patch("me/commercial")
  @ApiOkResponse({ description: "Atualiza dados comerciais da empresa" })
  updateCommercial(
    @CurrentUser() authUser: SupabaseUser,
    @Body() dto: UpdateCompanyCommercialDto,
  ) {
    return this.companyService.updateCommercial(authUser, dto);
  }

  @Post("me/complete-onboarding")
  @ApiOkResponse({ description: "Conclui onboarding da empresa" })
  completeOnboarding(@CurrentUser() authUser: SupabaseUser) {
    return this.companyService.completeOnboarding(authUser);
  }
}
