import { Metadata } from "next";
import PengaduanPublicClient from "./PengaduanPublicClient";

export const metadata: Metadata = {
  title: "Kotak Aspirasi & Pengaduan Anonim | HIMASTI UMMAT",
  description: "Layanan whistleblowing dan aspirasi mahasiswa Teknik Informatika UMMAT 100% rahasia, aman, dan tanpa login.",
};

export default function PengaduanPage() {
  return <PengaduanPublicClient />;
}
