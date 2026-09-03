import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let databaseUrl = process.env.DATABASE_URL || "postgresql://postgres.fitijhdpptnlslvbfxbl:HimastiUmmat@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres";

// Gunakan port 5432 session mode yang stabil untuk prepared statements dan anti-timeout
if (databaseUrl.includes(':6543')) {
  databaseUrl = databaseUrl.replace(':6543', ':5432').replace('?pgbouncer=true', '');
}

// Pastikan connection pooling diatur ketat (connection_limit=5&pool_timeout=30)
// agar tidak melebihi kuota pooler Supabase saat hot reload Next.js
const separator = databaseUrl.includes('?') ? '&' : '?';
if (!databaseUrl.includes('connection_limit=')) {
  databaseUrl = `${databaseUrl}${separator}connection_limit=5&pool_timeout=30`;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
