import type { z } from "zod";
import type { publicUserSchema } from "../schemas/user.schema.js";

export type PublicUser = z.infer<typeof publicUserSchema>;
