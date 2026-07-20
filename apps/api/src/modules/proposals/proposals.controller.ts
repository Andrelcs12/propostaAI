import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { FastifyReply } from "fastify";
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

  @Get("references")
  @ApiOkResponse({ description: "Referencias de propostas anteriores" })
  getReferences(
    @CurrentUser() authUser: SupabaseUser,
    @Query("proposalId") proposalId?: string,
  ) {
    return this.proposalsService.getReferences(authUser, proposalId);
  }

  @Get()
  @ApiOkResponse({ description: "Lista propostas do usuario" })
  list(@CurrentUser() authUser: SupabaseUser) {
    return this.proposalsService.list(authUser);
  }

  @Get(":id/pdf")
  async exportPdf(
    @CurrentUser() authUser: SupabaseUser,
    @Param("id") id: string,
    @Res() reply: FastifyReply,
  ) {
    const { buffer, filename } = await this.proposalsService.exportPdf(
      authUser,
      id,
    );

    return reply
      .header("Content-Type", "application/pdf")
      .header("Content-Disposition", `attachment; filename="${filename}"`)
      .send(buffer);
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

  @Post(":id/publish")
  @ApiOkResponse({ description: "Ativa link publico para o cliente" })
  publish(
    @CurrentUser() authUser: SupabaseUser,
    @Param("id") id: string,
  ) {
    return this.proposalsService.publish(authUser, id);
  }

  @Post(":id/unpublish")
  @ApiOkResponse({ description: "Desativa link publico" })
  unpublish(
    @CurrentUser() authUser: SupabaseUser,
    @Param("id") id: string,
  ) {
    return this.proposalsService.unpublish(authUser, id);
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
