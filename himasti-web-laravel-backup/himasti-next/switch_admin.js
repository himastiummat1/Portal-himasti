const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  // 1. Create or update kabid.riset@himasti.org
  const user = await prisma.user.upsert({
    where: { email: 'kabid.riset@himasti.org' },
    update: { password: hashedPassword, name: 'Kabid Riset' },
    create: {
      name: 'Kabid Riset',
      email: 'kabid.riset@himasti.org',
      password: hashedPassword,
    },
  });

  // 2. Get the super_admin role
  const role = await prisma.role.findFirst({ where: { name: 'super_admin' } });
  
  if (role && user) {
    // 3. Assign role to kabid.riset
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
  }

  // 4. Hapus admin@himasti.ac.id
  try {
    await prisma.user.delete({ where: { email: 'admin@himasti.ac.id' } });
    console.log("Akun admin@himasti.ac.id berhasil dihapus.");
  } catch (e) {
    console.log("Akun admin@himasti.ac.id tidak ditemukan atau sudah dihapus.");
  }

  console.log("Akun kabid.riset@himasti.org berhasil diset sebagai super_admin!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
