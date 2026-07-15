import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { PrismaService } from "../../database/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrSyncFromSupabase(authUser: SupabaseUser) {
    const email = authUser.email;

    if (!email) {
      throw new UnauthorizedException("Usuario autenticado sem e-mail");
    }

    const metadata = authUser.user_metadata;
    const name =
      typeof metadata.name === "string"
        ? metadata.name
        : typeof metadata.full_name === "string"
          ? metadata.full_name
          : email.split("@")[0] ?? "Usuario";
    const avatarUrl =
      typeof metadata.avatar_url === "string" ? metadata.avatar_url : null;

    const user = await this.prisma.user.upsert({
      where: { supabaseUserId: authUser.id },
      update: {
        name,
        email,
        avatarUrl
      },
      create: {
        supabaseUserId: authUser.id,
        name,
        email,
        avatarUrl
      }
    });

    return {
      id: user.id,
      supabaseUserId: user.supabaseUserId,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString()
    };
  }
}
