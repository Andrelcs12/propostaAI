import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Min,
  ValidateNested,
} from "class-validator";
import { ProposalTone } from "../../../generated/prisma/enums";

function emptyToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

export class ProposalListItemDto {
  @IsString()
  @Length(1, 200)
  id!: string;

  @IsString()
  @Length(1, 500)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class ProposalTimelineItemDto {
  @IsString()
  @Length(1, 200)
  id!: string;

  @IsString()
  @Length(1, 200)
  title!: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  order!: number;
}

export class ProposalInvestmentItemDto {
  @IsString()
  @Length(1, 200)
  id!: string;

  @IsString()
  @Length(1, 200)
  label!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Number)
  @IsNumber()
  order!: number;
}

export class CreateProposalDto {
  @IsString()
  @Length(2, 200)
  clientName!: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 120)
  clientContactName?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsEmail()
  clientEmail?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 40)
  clientPhone?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 80)
  clientSegment?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsUrl({ require_protocol: true })
  clientWebsite?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 1200)
  clientDescription?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 1200)
  clientProblem?: string;

  @IsString()
  @Length(2, 200)
  title!: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 300)
  serviceOffered?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 1200)
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
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 600)
  paymentConditions?: string;

  @IsOptional()
  @IsDateString()
  validityDate?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 1200)
  observations?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  differentials?: string[];

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 1200)
  nextSteps?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 1200)
  terms?: string;

  @IsOptional()
  @IsEnum(ProposalTone)
  tone?: ProposalTone;
}
