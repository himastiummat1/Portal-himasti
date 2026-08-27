const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  const roles = await prisma.role.findMany({ select: { id: true } });
  const roleIds = roles.map(r => r.id);
  
  const deletedCount = await prisma.modelHasRole.deleteMany({
    where: {
      role_id: { notIn: roleIds }
    }
  });
  
  console.log(`Deleted ${deletedCount.count} orphaned model_has_roles records.`);
}

fix().finally(() => prisma.$disconnect());
