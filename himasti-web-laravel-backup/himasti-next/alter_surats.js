const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE surats ADD COLUMN IF NOT EXISTS tanggal_surat TIMESTAMP DEFAULT NOW();`);
    await prisma.$executeRawUnsafe(`ALTER TABLE surats ADD COLUMN IF NOT EXISTS pengirim TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE surats ADD COLUMN IF NOT EXISTS tujuan TEXT;`);
    await prisma.$executeRawUnsafe(`ALTER TABLE surats ADD COLUMN IF NOT EXISTS file_path TEXT;`);
    console.log("Database altered successfully!");
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
