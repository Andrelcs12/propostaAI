import { z } from "zod";

export const publicUserSchema = z.object({
  id: z.string(),
  supabaseUserId: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().url().nullable(),
  createdAt: z.string()
});
