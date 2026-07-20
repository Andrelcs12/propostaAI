import { IsEnum } from "class-validator";
import { ProfileType } from "../../../generated/prisma/enums";

export class UpdateProfileTypeDto {
  @IsEnum(ProfileType)
  profileType!: ProfileType;
}
