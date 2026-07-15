import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, type User } from "@supabase/supabase-js";

@Injectable()
export class AuthService {
  private readonly supabase?: ReturnType<typeof createClient>;

  constructor(configService: ConfigService) {
    const supabaseUrl = configService.get<string>("SUPABASE_URL");
    const supabaseKey =
      configService.get<string>("SUPABASE_SERVICE_ROLE_KEY") ??
      configService.get<string>("SUPABASE_ANON_KEY");

    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
    }
  }

  async validateAccessToken(token: string): Promise<User> {
    if (!this.supabase) {
      throw new UnauthorizedException(
        "Supabase Auth nao configurado. Defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no apps/api/.env",
      );
    }

    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException("Token de autenticacao invalido");
    }

    return data.user;
  }
}
