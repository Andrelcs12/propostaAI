import { Module } from "@nestjs/common";
import { DatabaseModule } from "../../database/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { CompanyController } from "./company.controller";
import { CompanyLogoStorageService } from "./company-logo-storage.service";
import { CompanyService } from "./company.service";

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule],
  controllers: [CompanyController],
  providers: [CompanyService, CompanyLogoStorageService],
  exports: [CompanyService],
})
export class CompanyModule {}
