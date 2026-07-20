import { IsArray, IsOptional, IsString, IsUrl, Length } from "class-validator";

export class SearchCompanyDto {
  @IsString()
  @Length(2, 200)
  name!: string;

  @IsOptional()
  @IsString()
  @Length(1, 120)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(2, 2)
  state?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  website?: string;
}

export class AnalyzeCompanyDto {
  @IsString()
  @Length(2, 200)
  name!: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  website?: string;

  @IsOptional()
  @IsArray()
  @IsUrl({ require_protocol: true }, { each: true })
  sourceUrls?: string[];
}
