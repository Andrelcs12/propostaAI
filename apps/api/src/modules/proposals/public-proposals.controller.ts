import {
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Body,
  Query,
} from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ProposalsService } from "./proposals.service";
import {
  AcceptProposalDto,
  RejectProposalDto,
} from "./dto/public-proposal.dto";

@ApiTags("proposals")
@Controller("proposals/public")
export class PublicProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Get(":token")
  @ApiOkResponse({ description: "Proposta publica para cliente" })
  getPublic(
    @Param("token") token: string,
    @Query("print") print: string | undefined,
    @Headers("x-render-secret") renderSecret: string | undefined,
  ) {
    return this.proposalsService.getByPublicToken(token, {
      allowPrint: print === "1",
      renderSecret,
    });
  }

  @Post(":token/accept")
  @ApiOkResponse({ description: "Aceita proposta publica" })
  accept(@Param("token") token: string, @Body() dto: AcceptProposalDto) {
    return this.proposalsService.acceptPublic(token, dto);
  }

  @Post(":token/reject")
  @ApiOkResponse({ description: "Recusa proposta publica" })
  reject(@Param("token") token: string, @Body() dto: RejectProposalDto) {
    return this.proposalsService.rejectPublic(token, dto);
  }
}
