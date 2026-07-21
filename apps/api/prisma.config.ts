import "dotenv/config";
import { defineConfig } from "prisma/config";

// Migrations exigem Session Pooler (5432), não Transaction Pooler (6543).
const databaseUrl =
  process.env.DIRECT_DATABASE_URL ||
  process.env.DATABASE_URL ||
  "postgresql://postgres:postgres@localhost:5438/proposta_ai";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
