import { Body, Controller, Get, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { CompanyService } from "./company.service";
import { UpdateCompanyBasicDto } from "./dto/update-company-basic.dto";
import { UpdateCompanyBrandDto } from "./dto/update-company-brand.dto";
import { UpdateCompanyCommercialDto } from "./dto/update-company-commercial.dto";
import { UpdateCompanyDefaultsDto } from "./dto/update-company-defaults.dto";
import { UpdateCompanyIdentityDto } from "./dto/update-company-identity.dto";
import { UpdateProfileTypeDto } from "./dto/update-profile-type.dto";

@ApiTags("company")
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller("company")
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get("me")
  @ApiOkResponse({ description: "Perfil comercial do usuario autenticado" })
  getMe(@CurrentUser() authUser: SupabaseUser) {
    return this.companyService.getMyCompany(authUser);
  }

  @Patch("me/profile-type")
  @ApiOkResponse({ description: "Define tipo de perfil" })
  updateProfileType(
    @CurrentUser() authUser: SupabaseUser,
    @Body() dto: UpdateProfileTypeDto,
  ) {
    return this.companyService.updateProfileType(authUser, dto);
  }

  @Patch("me/basic")
  @ApiOkResponse({ description: "Atualiza dados principais" })
  updateBasic(
    @CurrentUser() authUser: SupabaseUser,
    @Body() dto: UpdateCompanyBasicDto,
  ) {
    return this.companyService.updateBasic(authUser, dto);
  }

  @Patch("me/brand")
  @ApiOkResponse({ description: "Atualiza identidade visual" })
  updateBrand(
    @CurrentUser() authUser: SupabaseUser,
    @Body() dto: UpdateCompanyBrandDto,
  ) {
    return this.companyService.updateBrand(authUser, dto);
  }

  @Patch("me/identity")
  @ApiOkResponse({ description: "Atualiza identidade comercial" })
  updateIdentity(
    @CurrentUser() authUser: SupabaseUser,
    @Body() dto: UpdateCompanyIdentityDto,
  ) {
    return this.companyService.updateIdentity(authUser, dto);
  }

  @Patch("me/defaults")
  @ApiOkResponse({ description: "Atualiza padroes das propostas" })
  updateDefaults(
    @CurrentUser() authUser: SupabaseUser,
    @Body() dto: UpdateCompanyDefaultsDto,
  ) {
    return this.companyService.updateDefaults(authUser, dto);
  }

  @Patch("me/commercial")
  @ApiOkResponse({ description: "Atualiza dados comerciais legados" })
  updateCommercial(
    @CurrentUser() authUser: SupabaseUser,
    @Body() dto: UpdateCompanyCommercialDto,
  ) {
    return this.companyService.updateCommercial(authUser, dto);
  }

  @Post("me/complete-onboarding")
  @ApiOkResponse({ description: "Conclui onboarding" })
  completeOnboarding(@CurrentUser() authUser: SupabaseUser) {
    return this.companyService.completeOnboarding(authUser);
  }
}
