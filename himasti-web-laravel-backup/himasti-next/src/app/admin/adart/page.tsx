import { BookOpen } from "lucide-react";

export default function AdArtPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-sky-600" />
          Konstitusi (AD/ART) HIMASTI
        </h1>
        <p className="text-gray-500 mt-1">Anggaran Dasar dan Anggaran Rumah Tangga Himpunan Mahasiswa Teknik Informatika.</p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm prose prose-sky max-w-none">
        <h2>BAB I: NAMA, WAKTU, DAN TEMPAT KEDUDUKAN</h2>
        <p><strong>Pasal 1: Nama</strong><br/>
        Organisasi ini bernama Himpunan Mahasiswa Teknik Informatika Universitas Muhammadiyah Mataram, disingkat HIMASTI UMMAT.</p>
        
        <p><strong>Pasal 2: Waktu</strong><br/>
        HIMASTI UMMAT didirikan di Mataram untuk batas waktu yang tidak ditentukan.</p>

        <h2>BAB II: ASAS DAN TUJUAN</h2>
        <p><strong>Pasal 3: Asas</strong><br/>
        HIMASTI UMMAT berasaskan Pancasila dan Tri Dharma Perguruan Tinggi.</p>

        <p><strong>Pasal 4: Tujuan</strong><br/>
        Membina insan akademis, pencipta, pengabdi yang bernafaskan Islam, dan bertanggung jawab atas terwujudnya masyarakat adil makmur yang diridhai Allah SWT.</p>

        <hr className="my-8 border-gray-100" />
        
        <div className="bg-sky-50 p-4 rounded-lg border border-sky-100">
          <p className="text-sm text-sky-800 m-0 font-medium">
            Catatan: Ini adalah pratinjau digital dari AD/ART. Untuk dokumen cetak atau perubahan terbaru, silakan hubungi Bidang Keorganisasian.
          </p>
        </div>
      </div>
    </div>
  );
}
