const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function fix() {
  // Alter DB to allow nulls
  await prisma.$executeRawUnsafe(`ALTER TABLE surats ALTER COLUMN user_id DROP NOT NULL;`);
  
  // Update schema
  let content = fs.readFileSync('prisma/schema.prisma', 'utf8');
  content = content.replace(
    '  user_id           Int\n  user              User      @relation(fields: [user_id], references: [id], onDelete: Cascade)',
    '  user_id           Int?\n  user              User?     @relation(fields: [user_id], references: [id], onDelete: SetNull)'
  );
  fs.writeFileSync('prisma/schema.prisma', content);
  
  console.log("Surat user_id is now optional!");
}

fix().finally(() => prisma.$disconnect());
