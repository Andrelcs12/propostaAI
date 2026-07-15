import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { AuthenticatedRequest } from "../types/authenticated-request";

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): SupabaseUser => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    return request.authUser;
  }
);
