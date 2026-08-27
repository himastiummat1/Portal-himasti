const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const newRoles = [
    "anggota_pengkaderan",
    "anggota_metkom",
    "anggota_litbang",
    "anggota_humas",
    "anggota_kemuhammadiyahan",
    "anggota_keorganisasian",
    "anggota_kewirausahaan",
    "anggota_mikat",
    "anggota_aksi_advokasi"
  ];

  for (const roleName of newRoles) {
    await prisma.role.upsert({
      where: { name_guard_name: { name: roleName, guard_name: 'web' } },
      update: {},
      create: { name: roleName, guard_name: 'web' }
    });
  }
}
seed().finally(() => prisma.$disconnect());
