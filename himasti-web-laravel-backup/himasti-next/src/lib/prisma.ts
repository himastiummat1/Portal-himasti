import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let databaseUrl = process.env.DATABASE_URL || "postgresql://postgres.fitijhdpptnlslvbfxbl:HimastiUmmat@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres";

// Gunakan port 5432 session mode yang stabil untuk prepared statements dan anti-timeout
if (databaseUrl.includes(':6543')) {
  databaseUrl = databaseUrl.replace(':6543', ':5432').replace('?pgbouncer=true', '');
}

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
