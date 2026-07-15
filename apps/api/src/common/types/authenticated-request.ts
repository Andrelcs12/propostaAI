import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { FastifyRequest } from "fastify";

export type AuthenticatedRequest = FastifyRequest & {
  authUser: SupabaseUser;
};
