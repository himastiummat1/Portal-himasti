const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const roles = await prisma.role.findMany();
  console.log(roles.map(r => r.name).join(', '));
}

check().finally(() => prisma.$disconnect());
