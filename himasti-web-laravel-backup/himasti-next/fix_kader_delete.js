const fs = require('fs');
let content = fs.readFileSync('src/app/admin/kader/actions.ts', 'utf8');

const oldDelete = `    // Cascade delete works mostly, but let's be safe and delete manually if needed
    // Assuming deleting the User will cascade to DataKader, ModelHasRole, etc.
    await prisma.user.delete({ where: { id: userId } });`;

const newDelete = `    // Karena DB bawaan Laravel mungkin tidak memiliki FK Constraint CASCADE,
    // kita hapus secara manual dari tabel-tabel relasinya terlebih dahulu!
    await prisma.dataKader.deleteMany({ where: { user_id: userId } });
    await prisma.modelHasRole.deleteMany({ where: { model_id: userId, model_type: "App\\\\Models\\\\User" } });
    await prisma.surat.deleteMany({ where: { user_id: userId } });
    await prisma.keuangan.updateMany({ where: { user_id: userId }, data: { user_id: null } });
    
    // Baru hapus User utamanya
    await prisma.user.delete({ where: { id: userId } });`;

content = content.replace(oldDelete, newDelete);
fs.writeFileSync('src/app/admin/kader/actions.ts', content);
