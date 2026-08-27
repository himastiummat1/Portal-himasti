const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const superAdminRole = await prisma.role.findFirst({
    where: { name: 'super_admin' }
  });

  if (!superAdminRole) {
    console.log("Super admin role not found");
    return;
  }

  const user = await prisma.user.findFirst({
    where: { email: 'kabidriset@himasti.ac.id' }
  });

  if (!user) {
    console.log("User not found");
    return;
  }

  // Use raw SQL to bypass prisma unique constraint naming issues just to be absolutely sure
  await prisma.$executeRawUnsafe(`
    INSERT INTO model_has_roles (role_id, model_type, model_id)
    VALUES (${superAdminRole.id}, 'App\\Models\\User', ${user.id})
    ON CONFLICT (role_id, model_id, model_type) DO NOTHING;
  `);

  console.log("Role assigned successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
