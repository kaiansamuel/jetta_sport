import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Prisma 7's config datasource only exposes `url`/`shadowDatabaseUrl` (no
  // `directUrl`), so the CLI (migrate/studio) is pointed at the unpooled
  // Neon connection to avoid DDL issues over the pgbouncer pooler. The app
  // runtime uses DATABASE_URL (pooled) directly via the Neon adapter in
  // src/lib/db/prisma.ts, independent of this file.
  datasource: {
    url: env("DIRECT_URL"),
  },
});
