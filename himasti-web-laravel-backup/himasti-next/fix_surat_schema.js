const fs = require('fs');
let content = fs.readFileSync('prisma/schema.prisma', 'utf8');

const oldSurat = `model Surat {
  id                Int       @id @default(autoincrement())
  user_id           Int
  user              User      @relation(fields: [user_id], references: [id], onDelete: Cascade)
  nomor_surat       String?
  jenis_surat       String
  perihal           String
  status            String    @default("pending") // 'pending', 'approved', 'rejected'
  file_pdf          String?
  deleted_at        DateTime?
  created_at        DateTime  @default(now())
  updated_at        DateTime  @updatedAt

  @@map("surats")
}`;

const newSurat = `model Surat {
  id                Int       @id @default(autoincrement())
  user_id           Int
  user              User      @relation(fields: [user_id], references: [id], onDelete: Cascade)
  nomor_surat       String?
  jenis_surat       String    // "Masuk" atau "Keluar"
  perihal           String
  tanggal_surat     DateTime  @default(now())
  pengirim          String?
  tujuan            String?
  status            String    @default("pending")
  file_path         String?
  deleted_at        DateTime?
  created_at        DateTime  @default(now())
  updated_at        DateTime  @updatedAt

  @@map("surats")
}`;

content = content.replace(oldSurat, newSurat);
fs.writeFileSync('prisma/schema.prisma', content);
