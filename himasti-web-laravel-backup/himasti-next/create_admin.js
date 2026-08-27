const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@himasti.ac.id' },
    update: { password: hashedPassword },
    create: {
      name: 'Admin HIMASTI',
      email: 'admin@himasti.ac.id',
      password: hashedPassword,
    },
  });
  console.log("Admin user ready: admin@himasti.ac.id / admin123");
}

main().catch(console.error).finally(() => prisma.$disconnect());
