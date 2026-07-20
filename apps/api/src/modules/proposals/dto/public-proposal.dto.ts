import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class AcceptProposalDto {
  @IsString()
  @Length(2, 120)
  acceptedByName!: string;

  @IsOptional()
  @IsEmail()
  acceptedByEmail?: string;
}

export class RejectProposalDto {
  @IsOptional()
  @IsString()
  @Length(1, 600)
  rejectionReason?: string;
}
