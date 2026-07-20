import { IsEnum, IsOptional, IsString, Length } from "class-validator";
import { ProposalTone } from "../../../generated/prisma/enums";

export class GenerateProposalDto {
  @IsOptional()
  @IsEnum(ProposalTone)
  tone?: ProposalTone;

  @IsOptional()
  @IsString()
  @Length(1, 80)
  section?: string;
}
