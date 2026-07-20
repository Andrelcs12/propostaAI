import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ProposalTone } from "../../../generated/prisma/enums";
import {
  ProposalInvestmentItemDto,
  ProposalListItemDto,
  ProposalTimelineItemDto,
} from "./create-proposal.dto";

function emptyToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

export class UpdateProposalDto {
  @IsOptional()
  @IsString()
  @Length(2, 200)
  clientName?: string;

  @IsOptional()
  @IsString()
  clientContactName?: string;

  @IsOptional()
  @IsEmail()
  clientEmail?: string;

  @IsOptional()
  @IsString()
  clientPhone?: string;

  @IsOptional()
  @IsString()
  clientSegment?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  clientWebsite?: string;

  @IsOptional()
  @IsString()
  clientDescription?: string;

  @IsOptional()
  @IsString()
  clientProblem?: string;

  @IsOptional()
  @IsString()
  @Length(2, 200)
  title?: string;

  @IsOptional()
  @IsString()
  serviceOffered?: string;

  @IsOptional()
  @IsString()
  objective?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProposalListItemDto)
  scope?: ProposalListItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProposalListItemDto)
  deliverables?: ProposalListItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProposalTimelineItemDto)
  timeline?: ProposalTimelineItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProposalInvestmentItemDto)
  investment?: ProposalInvestmentItemDto[];

  @IsOptional()
  @IsString()
  paymentConditions?: string;

  @IsOptional()
  @IsDateString()
  validityDate?: string;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  differentials?: string[];

  @IsOptional()
  @IsString()
  nextSteps?: string;

  @IsOptional()
  @IsString()
  terms?: string;

  @IsOptional()
  @IsEnum(ProposalTone)
  tone?: ProposalTone;

  @IsOptional()
  @IsObject()
  generatedContent?: Record<string, unknown>;
}
