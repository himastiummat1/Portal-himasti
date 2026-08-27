const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  await prisma.role.upsert({
    where: { name_guard_name: { name: "demisioner", guard_name: 'web' } },
    update: {},
    create: { name: "demisioner", guard_name: 'web' }
  });
  console.log("Demisioner seeded!");
}

seed().finally(() => prisma.$disconnect());
