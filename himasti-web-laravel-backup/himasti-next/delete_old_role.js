const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
  await prisma.role.deleteMany({
    where: { name: 'admin_sekretariat' }
  });
  console.log('Deleted admin_sekretariat');
}

clean().finally(() => prisma.$disconnect());
