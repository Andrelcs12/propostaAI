import { UnauthorizedException } from "@nestjs/common";
import type { ExecutionContext } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { SupabaseAuthGuard } from "./supabase-auth.guard";

function createContext(authorization?: string) {
  const request = {
    headers: { authorization },
  };

  return {
    request,
    context: {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext,
  };
}

describe("SupabaseAuthGuard", () => {
  it("rejects requests without bearer token", async () => {
    const guard = new SupabaseAuthGuard({
      validateAccessToken: vi.fn(),
    });
    const { context } = createContext();

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it("attaches the validated Supabase user to the request", async () => {
    const authUser = { id: "supabase-user-id", email: "andre@novely.com" };
    const guard = new SupabaseAuthGuard({
      validateAccessToken: vi.fn().mockResolvedValue(authUser),
    });
    const { context, request } = createContext("Bearer valid-token");

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request).toMatchObject({ authUser });
  });
});
