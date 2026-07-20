import { Transform } from "class-transformer";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";

function emptyToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

export class UpdateCompanyIdentityDto {
  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 120)
  tradeName?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 1200)
  presentationText?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 120)
  responsibleName?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 120)
  responsibleRole?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsString()
  @Length(1, 600)
  contactText?: string;

  @IsOptional()
  @IsBoolean()
  showContactData?: boolean;

  @IsOptional()
  @IsBoolean()
  showSignature?: boolean;
}
