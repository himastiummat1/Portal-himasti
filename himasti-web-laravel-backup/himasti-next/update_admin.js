const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('himasti231120', 12);
  
  // Find the super_admin role
  const superAdminRole = await prisma.role.findFirst({
    where: { name: 'super_admin' }
  });

  if (!superAdminRole) {
    console.log("Role super_admin not found");
    return;
  }

  // Update the user
  const user = await prisma.user.upsert({
    where: { email: 'admin@himasti.ac.id' },
    update: { 
      email: 'kabidriset@himasti.ac.id',
      password: hashedPassword,
      name: 'Kabid Riset'
    },
    create: {
      name: 'Kabid Riset',
      email: 'kabidriset@himasti.ac.id',
      password: hashedPassword,
    },
  });

  // Ensure role is assigned
  await prisma.modelHasRole.upsert({
    where: {
      role_id_model_type_model_id: {
        role_id: superAdminRole.id,
        model_type: 'App\\Models\\User',
        model_id: user.id
      }
    },
    update: {},
    create: {
      role_id: superAdminRole.id,
      model_type: 'App\\Models\\User',
      model_id: user.id
    }
  });

  console.log("Updated successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
