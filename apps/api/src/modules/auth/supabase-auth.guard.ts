import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { AuthenticatedRequest } from "../../common/types/authenticated-request";
import { AuthService } from "./auth.service";

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Token de autenticacao ausente");
    }

    const token = authorization.replace("Bearer ", "").trim();
    request.authUser = await this.authService.validateAccessToken(token);

    return true;
  }
}
