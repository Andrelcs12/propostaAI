import { UnauthorizedException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { SupabaseAuthGuard } from "./supabase-auth.guard";

function createContext(authorization?: string) {
  const request = {
    headers: { authorization }
  };

  return {
    request,
    context: {
      switchToHttp: () => ({
        getRequest: () => request
      })
    }
  };
}

describe("SupabaseAuthGuard", () => {
  it("rejects requests without bearer token", async () => {
    const guard = new SupabaseAuthGuard({
      validateAccessToken: vi.fn()
    } as never);
    const { context } = createContext();

    await expect(guard.canActivate(context as never)).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("attaches the validated Supabase user to the request", async () => {
    const authUser = { id: "supabase-user-id", email: "andre@novely.com" };
    const guard = new SupabaseAuthGuard({
      validateAccessToken: vi.fn().mockResolvedValue(authUser)
    } as never);
    const { context, request } = createContext("Bearer valid-token");

    await expect(guard.canActivate(context as never)).resolves.toBe(true);
    expect(request).toMatchObject({ authUser });
  });
});
