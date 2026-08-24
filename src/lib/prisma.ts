import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

let connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || ''
if (connectionString.includes('postgrespgbouncer')) {
  connectionString = connectionString.replace('postgrespgbouncer', 'postgres?pgbouncer')
}
if (connectionString.includes('?')) {
  connectionString = connectionString.split('?')[0]
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
