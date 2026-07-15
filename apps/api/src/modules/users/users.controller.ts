import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { SupabaseAuthGuard } from "../auth/supabase-auth.guard";
import { UsersService } from "./users.service";

@ApiTags("users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @UseGuards(SupabaseAuthGuard)
  @ApiOkResponse({ description: "Perfil publico do usuario autenticado" })
  getMe(@CurrentUser() authUser: SupabaseUser) {
    return this.usersService.findOrSyncFromSupabase(authUser);
  }
}
