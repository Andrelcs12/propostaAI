import { UnauthorizedException } from "@nestjs/common";
import { describe, expect, it, vi } from "vitest";
import { UsersService } from "./users.service";

describe("UsersService", () => {
  it("updates an existing user matched by supabase id", async () => {
    const findUnique = vi
      .fn()
      .mockResolvedValueOnce({
        id: "user-id",
        supabaseUserId: "supabase-id",
      })
      .mockResolvedValueOnce(null);
    const update = vi.fn().mockResolvedValue({
      id: "user-id",
      supabaseUserId: "supabase-id",
      name: "Andre Lucas",
      email: "andre@novely.com",
      avatarUrl: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    const service = new UsersService({
      user: { findUnique, update, create: vi.fn() },
    } as never);

    const result = await service.findOrSyncFromSupabase({
      id: "supabase-id",
      email: "andre@novely.com",
      user_metadata: { name: "Andre Lucas" },
    } as never);

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user-id" },
      }),
    );
    expect(result.email).toBe("andre@novely.com");
  });

  it("links an existing e-mail to a new supabase id", async () => {
    const findUnique = vi
      .fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: "user-id",
        email: "andre@novely.com",
      });
    const update = vi.fn().mockResolvedValue({
      id: "user-id",
      supabaseUserId: "supabase-id",
      name: "Andre Lucas",
      email: "andre@novely.com",
      avatarUrl: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    const service = new UsersService({
      user: { findUnique, update, create: vi.fn() },
    } as never);

    await service.findOrSyncFromSupabase({
      id: "supabase-id",
      email: "andre@novely.com",
      user_metadata: { name: "Andre Lucas" },
    } as never);

    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "user-id" },
        data: expect.objectContaining({
          supabaseUserId: "supabase-id",
        }),
      }),
    );
  });

  it("rejects authenticated users without e-mail", async () => {
    const service = new UsersService({
      user: { findUnique: vi.fn(), update: vi.fn(), create: vi.fn() },
    } as never);

    await expect(
      service.findOrSyncFromSupabase({
        id: "supabase-id",
        user_metadata: {},
      } as never),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
