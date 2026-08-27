import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// Hardcoded emergency URL because Vercel Environment Variable is corrupted (missing '?')
const databaseUrl = "postgresql://postgres.fitijhdpptnlslvbfxbl:HimastiUmmat@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
