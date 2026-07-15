import { describe, expect, it } from "vitest";
import { registerSchema } from "./auth.schema";

describe("registerSchema", () => {
  it("requires a valid e-mail and a minimum password length", () => {
    const result = registerSchema.safeParse({
      name: "Andre",
      email: "email-invalido",
      password: "123"
    });

    expect(result.success).toBe(false);
  });
});
