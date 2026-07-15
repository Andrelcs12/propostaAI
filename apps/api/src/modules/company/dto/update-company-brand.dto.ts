import { Transform } from "class-transformer";
import { IsEnum, IsOptional, IsString, IsUrl, Matches } from "class-validator";
import {
  CompanyFontPreference,
  CompanyVisualPreference,
  CompanyVisualStyle,
} from "../../../generated/prisma/enums";

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

function emptyToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

export class UpdateCompanyBrandDto {
  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsUrl({ require_protocol: true })
  logoUrl?: string;

  @IsOptional()
  @Transform(({ value }) => emptyToUndefined(value))
  @IsUrl({ require_protocol: true })
  lightLogoUrl?: string;

  @Matches(HEX_COLOR, {
    message: "primaryColor deve ser uma cor hexadecimal valida",
  })
  primaryColor!: string;

  @Matches(HEX_COLOR, {
    message: "secondaryColor deve ser uma cor hexadecimal valida",
  })
  secondaryColor!: string;

  @Matches(HEX_COLOR, {
    message: "accentColor deve ser uma cor hexadecimal valida",
  })
  accentColor!: string;

  @Matches(HEX_COLOR, {
    message: "backgroundColor deve ser uma cor hexadecimal valida",
  })
  backgroundColor!: string;

  @Matches(HEX_COLOR, {
    message: "surfaceColor deve ser uma cor hexadecimal valida",
  })
  surfaceColor!: string;

  @Matches(HEX_COLOR, {
    message: "textColor deve ser uma cor hexadecimal valida",
  })
  textColor!: string;

  @IsEnum(CompanyVisualPreference)
  visualPreference!: CompanyVisualPreference;

  @IsEnum(CompanyFontPreference)
  fontPreference!: CompanyFontPreference;

  @IsEnum(CompanyVisualStyle)
  visualStyle!: CompanyVisualStyle;

  @IsString()
  @Matches(/^(SMALL|MEDIUM|LARGE)$/)
  borderRadius!: string;
}
