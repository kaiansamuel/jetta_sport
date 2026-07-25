import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Standard node-postgres adapter: works against local Postgres and Neon
// alike over the regular TCP connection string, which is all that's needed
// since the app runs in the Node.js runtime (Server Actions, Route
// Handlers), not the Edge runtime.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
