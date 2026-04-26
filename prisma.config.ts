import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Use the direct connection (not PgBouncer) for migrations and db push
    url: process.env.DIRECT_URL!,
  },
  migrations: {
    seed: "npx tsx --env-file=.env.local ./prisma/seed.ts",
  },
});
