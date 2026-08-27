const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const users = await prisma.user.findMany({ select: { id: true } });
  const userIds = users.map(u => u.id);
  
  const deletedCount = await prisma.dataKader.deleteMany({
    where: {
      user_id: { notIn: userIds }
    }
  });
  
  console.log(`Deleted ${deletedCount.count} orphaned data_kaders records.`);
}

fix().finally(() => prisma.$disconnect());
