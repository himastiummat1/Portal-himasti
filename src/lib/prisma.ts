import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Only use the DATABASE_URL (the pooler, which has IPv4 support)
let connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL || ''

// Force the pooler domain if possible, as it supports IPv4
if (connectionString.includes('db.fitijhdpptnlslvbfxbl.supabase.co')) {
  connectionString = connectionString.replace('db.fitijhdpptnlslvbfxbl.supabase.co', 'aws-0-ap-southeast-1.pooler.supabase.com')
}

// Force port 5432 (Session mode) which supports prepared statements perfectly
if (connectionString.includes(':6543')) {
  connectionString = connectionString.replace(':6543', ':5432')
}

// Remove query parameters because 'pg' driver adapter doesn't need them and might choke
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
