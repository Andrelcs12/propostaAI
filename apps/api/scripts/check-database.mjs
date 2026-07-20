import "dotenv/config";
import pg from "pg";

const connectionString =
  process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL nao configurada em apps/api/.env");
  process.exit(1);
}

const client = new pg.Client({ connectionString });

try {
  await client.connect();
  await client.query("SELECT 1");
  console.log("Banco conectado com sucesso.");
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Falha ao conectar ao banco:", message);
  console.error("");
  console.error("Docker local:");
  console.error("  1. Abra o Docker Desktop");
  console.error("  2. npm run db:up");
  console.error("  3. npm run db:migrate");
  console.error("");
  console.error("Supabase (sem Docker):");
  console.error("  1. Copie a connection string em Project Settings > Database");
  console.error("  2. Atualize DATABASE_URL e DIRECT_DATABASE_URL em apps/api/.env");
  console.error("  3. npm run db:migrate");
  process.exit(1);
} finally {
  await client.end().catch(() => undefined);
}
