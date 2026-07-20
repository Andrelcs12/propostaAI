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
          : (email.split("@")[0] ?? "Usuario");
    const avatarUrl =
      typeof metadata.avatar_url === "string" ? metadata.avatar_url : null;

    const existingBySupabase = await this.prisma.user.findUnique({
      where: { supabaseUserId: authUser.id },
    });

    if (existingBySupabase) {
      const user = await this.prisma.user.update({
        where: { id: existingBySupabase.id },
        data: { name, email, avatarUrl },
      });

      return this.toPublicUser(user);
    }

    const existingByEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingByEmail) {
      const user = await this.prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          supabaseUserId: authUser.id,
          name,
          avatarUrl,
        },
      });

      return this.toPublicUser(user);
    }

    const user = await this.prisma.user.create({
      data: {
        supabaseUserId: authUser.id,
        name,
        email,
        avatarUrl,
      },
    });

    return this.toPublicUser(user);
  }

  private toPublicUser(user: {
    id: string;
    supabaseUserId: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    createdAt: Date;
  }) {
    return {
      id: user.id,
      supabaseUserId: user.supabaseUserId,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
    };
  }
}
