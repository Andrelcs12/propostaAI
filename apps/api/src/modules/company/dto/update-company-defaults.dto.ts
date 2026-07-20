import { Transform, Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from "class-validator";
import { BillingType, ProposalTone } from "../../../generated/prisma/enums";

function emptyToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

export class UpdateCompanyDefaultsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(365)
  defaultValidityDays?: number;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 120)
  defaultDeliveryTime?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 600)
  defaultPaymentConditions?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(3, 3)
  defaultCurrency?: string;

  @IsOptional()
  @IsEnum(BillingType)
  defaultBillingType?: BillingType;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 1200)
  defaultIntroMessage?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 600)
  defaultClosingMessage?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 1200)
  defaultTerms?: string;

  @IsOptional()
  @IsBoolean()
  showDetailedValues?: boolean;

  @IsOptional()
  @IsBoolean()
  showDiscount?: boolean;

  @IsOptional()
  @IsEnum(ProposalTone)
  defaultTone?: ProposalTone;
}
