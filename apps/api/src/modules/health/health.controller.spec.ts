import { describe, expect, it, vi } from "vitest";
import { HealthController } from "./health.controller";

describe("HealthController", () => {
  it("returns ok status when database is reachable", async () => {
    const controller = new HealthController({
      $queryRaw: vi.fn().mockResolvedValue([{ "?column?": 1 }]),
    } as never);

    await expect(controller.getHealth()).resolves.toEqual({
      status: "ok",
      database: "ok",
    });
  });

  it("throws when database is unavailable", async () => {
    const controller = new HealthController({
      $queryRaw: vi.fn().mockRejectedValue(new Error("ECONNREFUSED")),
    } as never);

    await expect(controller.getHealth()).rejects.toMatchObject({
      response: expect.objectContaining({
        database: "unavailable",
      }),
    });
  });
});
