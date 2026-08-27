const fs = require('fs');
let content = fs.readFileSync('src/app/admin/surat/actions.ts', 'utf8');

// 1. In createSurat, update the create block
const oldCreate = `  await prisma.surat.create({
    data: {
      nomor_surat,
      jenis_surat,
      perihal,
      
      file_pdf: filePath,
      user_id: createdBy
    }
  });`;

const newCreate = `  await prisma.surat.create({
    data: {
      nomor_surat,
      jenis_surat,
      perihal,
      tanggal_surat,
      pengirim: jenis_surat === "Masuk" ? entitas : null,
      tujuan: jenis_surat === "Keluar" ? entitas : null,
      file_path: filePath,
      user_id: createdBy
    }
  });`;
content = content.replace(oldCreate, newCreate);

// 2. In deleteSurat, update file_pdf to file_path
content = content.replace(/surat\.file_pdf/g, 'surat.file_path');

fs.writeFileSync('src/app/admin/surat/actions.ts', content);
