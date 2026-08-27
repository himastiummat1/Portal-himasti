const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.user.findFirst({ where: { email: 'kabidriset@himasti.ac.id' } })
  .then(console.log)
  .finally(() => prisma.$disconnect());
