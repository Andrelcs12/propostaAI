import { UnauthorizedException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  it("syncs an authenticated Supabase user with Prisma using upsert", async () => {
    const upsert = vi.fn().mockResolvedValue({
      id: "user-id",
      supabaseUserId: "supabase-id",
      name: "Andre Lucas",
      email: "andre@novely.com",
      avatarUrl: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z")
    });
    const service = new UsersService({ user: { upsert } } as never);

    const result = await service.findOrSyncFromSupabase({
      id: "supabase-id",
      email: "andre@novely.com",
      user_metadata: { name: "Andre Lucas" }
    } as never);

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { supabaseUserId: "supabase-id" }
      })
    );
    expect(result.email).toBe("andre@novely.com");
  });

  it("rejects authenticated users without e-mail", async () => {
    const service = new UsersService({ user: { upsert: vi.fn() } } as never);

    await expect(
      service.findOrSyncFromSupabase({ id: "supabase-id", user_metadata: {} } as never)
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
