import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("CRITICAL SECURITY ERROR: DATABASE_URL is not set in environment variables.");
}

// Jika menggunakan Supabase port 6543, pastikan pgbouncer=true aktif agar mode transaksi jalan lancar
if (databaseUrl.includes(':6543') && !databaseUrl.includes('pgbouncer=true')) {
  const separator = databaseUrl.includes('?') ? '&' : '?';
  databaseUrl = `${databaseUrl}${separator}pgbouncer=true`;
}

// Konfigurasi pool connection agar tahan lonjakan query concurrent
const sep = databaseUrl.includes('?') ? '&' : '?';
if (!databaseUrl.includes('connection_limit=')) {
  databaseUrl = `${databaseUrl}${sep}connection_limit=15&pool_timeout=30`;
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
