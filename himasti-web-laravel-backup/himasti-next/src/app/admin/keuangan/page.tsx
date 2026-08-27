import { prisma } from "@/lib/prisma";
import KeuanganClient from "./KeuanganClient";

export const dynamic = "force-dynamic";

export default async function KeuanganPage() {
  const dataKeuangan = await prisma.keuangan.findMany({
    orderBy: {
      tanggal: 'desc'
    }
  });

  // Transform to plain objects for Client Component serialization
  const transformedRecords = dataKeuangan.map(record => ({
    id: record.id,
    tipe: record.tipe,
    // Convert Decimal to number
    jumlah: Number(record.nominal),
    // Convert Date to ISO string
    tanggal: record.tanggal.toISOString(),
    keterangan: record.keterangan
  }));

  return (
    <KeuanganClient records={transformedRecords} />
  );
}
