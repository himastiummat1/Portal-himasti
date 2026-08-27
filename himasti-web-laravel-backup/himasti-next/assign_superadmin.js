const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Get or Create Role
  let role = await prisma.role.findFirst({ where: { name: 'super_admin' } });
  if (!role) {
    role = await prisma.role.create({
      data: {
        name: 'super_admin',
        guard_name: 'web'
      }
    });
  }

  // Get User
  const user = await prisma.user.findUnique({ where: { email: 'admin@himasti.ac.id' } });
  
  if (user) {
    // Assign Role via ModelHasRole
    await prisma.modelHasRole.upsert({
      where: {
        role_id_model_id_model_type: {
          role_id: role.id,
          model_id: user.id,
          model_type: 'App\\Models\\User'
        }
      },
      update: {},
      create: {
        role_id: role.id,
        model_id: user.id,
        model_type: 'App\\Models\\User'
      }
    });
    console.log(`User ${user.email} is now a super_admin!`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
