import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { CreateProposalDto } from "./dto/create-proposal.dto";
import { GenerateProposalDto } from "./dto/generate-proposal.dto";
import { UpdateProposalDto } from "./dto/update-proposal.dto";
import { ProposalsService } from "./proposals.service";

@ApiTags("proposals")
@ApiBearerAuth()
@UseGuards(SupabaseAuthGuard)
@Controller("proposals")
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Get()
  @ApiOkResponse({ description: "Lista propostas do usuario" })
  list(@CurrentUser() authUser: SupabaseUser) {
    return this.proposalsService.list(authUser);
  }

  @Get(":id")
  @ApiOkResponse({ description: "Detalhe da proposta" })
  getById(
    @CurrentUser() authUser: SupabaseUser,
    @Param("id") id: string,
  ) {
    return this.proposalsService.getById(authUser, id);
  }

  @Post()
  @ApiOkResponse({ description: "Cria proposta em rascunho" })
  create(
    @CurrentUser() authUser: SupabaseUser,
    @Body() dto: CreateProposalDto,
  ) {
    return this.proposalsService.create(authUser, dto);
  }

  @Patch(":id")
  @ApiOkResponse({ description: "Atualiza proposta" })
  update(
    @CurrentUser() authUser: SupabaseUser,
    @Param("id") id: string,
    @Body() dto: UpdateProposalDto,
  ) {
    return this.proposalsService.update(authUser, id, dto);
  }

  @Post(":id/generate")
  @ApiOkResponse({ description: "Gera conteudo da proposta com IA" })
  generate(
    @CurrentUser() authUser: SupabaseUser,
    @Param("id") id: string,
    @Body() dto: GenerateProposalDto,
  ) {
    return this.proposalsService.generate(authUser, id, dto);
  }
}
