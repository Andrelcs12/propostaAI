import { publicUserSchema, type PublicUser } from "@novely/shared";
import { apiFetch } from "@/lib/api/client";

export async function getCurrentProfile(accessToken: string): Promise<PublicUser> {
  const response = await apiFetch<unknown>("/api/users/me", {
    accessToken,
    cache: "no-store"
  });

  return publicUserSchema.parse(response);
}
