const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function fix() {
  // Alter DB to add jenis_kelamin
  await prisma.$executeRawUnsafe(`ALTER TABLE data_kaders ADD COLUMN IF NOT EXISTS jenis_kelamin VARCHAR(10);`);
  
  // Update schema
  let content = fs.readFileSync('prisma/schema.prisma', 'utf8');
  content = content.replace(
    '  no_hp             String?',
    '  no_hp             String?\n  jenis_kelamin     String?'
  );
  fs.writeFileSync('prisma/schema.prisma', content);
  
  console.log("jenis_kelamin added!");
}

fix().finally(() => prisma.$disconnect());
