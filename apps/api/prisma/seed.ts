import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required for Prisma seed");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString })
});

async function main() {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  await prisma.user.upsert({
    where: { supabaseUserId: "local-template-user" },
    update: {},
    create: {
      supabaseUserId: "local-template-user",
      name: "Usuario local",
      email: "usuario.local@example.com"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
