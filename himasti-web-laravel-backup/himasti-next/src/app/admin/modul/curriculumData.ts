export interface Chapter {
  title: string;
  content: string;
}

export interface Course {
  title: string;
  badge?: string;
  isRecommended?: boolean;
  chapters: Chapter[];
}

export interface SemesterTrack {
  semester: string;
  isRecommended?: boolean;
  courses: Course[];
}

export const curriculumData: SemesterTrack[] = [
  {
    semester: "Kurikulum Khusus • AI Agentic Era 2026",
    isRecommended: true,
    courses: [
      {
        title: "AI Agentic Engineering & Model Context Protocol (MCP)",
        badge: "🔥 SANGAT DIREKOMENDASIKAN KABID RISET",
        isRecommended: true,
        chapters: [
          {
            title: "BAB 1: Revolusi Agentic AI — Mengapa Web Chat Mulai Ketinggalan Zaman?",
            content: `# BAB 1: Dari Chatbot Pasif ke AI Agent Otonom

Banyak mahasiswa IT saat ini masih terjebak di pola lama: membuka ChatGPT atau Gemini di peramban web, mengetik potongan kode terisolasi, lalu menyalinnya bolak-balik secara manual. Pola ini sangat lambat dan membuat mahasiswa bingung ketika proyek mulai kompleks.

## Perbedaan Mendasar: Web Chat vs AI Agent
1. Web Chat (Pasif): Hanya menerima prompt teks dan mengeluarkan teks. AI tidak bisa melihat repositori proyek Anda, tidak bisa menjalankan perintah terminal, dan tidak tahu apakah kodenya menghasilkan error saat dikompilasi.
2. AI Coding Agent (Aktif dan Otonom): Memiliki siklus loop: Observe, Plan, Tool Execution, dan Verify. Agent membaca struktur folder langsung, mengedit file spesifik menggunakan diff, menjalankan kompilasi typecheck atau unit test, dan otomatis memperbaiki diri jika terjadi error sintaks.

## Alat-Alat Utama Agentic Era:
- Cursor dan Windsurf: IDE modern bertenaga agen yang mampu membaca seluruh basis kode.
- Claude Code dan Google Antigravity: CLI Agent yang bisa mengendalikan terminal, git, dan sub-agent otonom.
- Model Context Protocol (MCP): Standar protokol terbuka yang menghubungkan LLM ke database, filesystem, dan server lokal.`
          },
          {
            title: "BAB 2: Anatomi IDE AI Agents (Cursor, Claude Code, Antigravity)",
            content: `# BAB 2: Anatomi dan Cara Kerja AI Coding Agent

Bagaimana sebuah agen AI bisa mengedit ratusan baris kode tanpa merusak keseluruhan aplikasi?

## 1. Kelompok Alat Utama (Tool Groups)
Sebuah agen AI modern dilengkapi dengan 3 kelompok perkakas kerja:
- Read Tools: Ripgrep untuk pencarian teks kilat, fd untuk pencarian nama file, dan view_file untuk membaca isi file secara presisi.
- Write Tools: replace_file_content untuk mengedit baris tertentu dengan presisi, dan write_to_file untuk membuat file baru.
- Execution Tools: run_command untuk menjalankan terminal bash, git status, npx tsc, dan npm run build.

## 2. Loop Verifikasi Otomatis
Programmer yang cerdas tidak percaya begitu saja pada output AI. Kita melatih agen untuk selalu menjalankan:
\`\`\`bash
# Verifikasi typecheck sebelum commit
npx tsc --noEmit
\`\`\`
Jika perintah verifikasi di atas menghasilkan error, agen akan secara otomatis membaca pesan error tersebut dan memperbaikinya sampai exit code menjadi 0.`
          },
          {
            title: "BAB 3: Model Context Protocol (MCP) — Standar Terbuka Industri",
            content: `# BAB 3: Memahami Model Context Protocol (MCP)

Model Context Protocol (MCP) adalah standar protokol terbuka yang diperkenalkan oleh Anthropic untuk memecahkan masalah integrasi AI.

## Kenapa MCP Dibutuhkan?
Sebelum ada MCP, jika Anda ingin AI Anda membaca database PostgreSQL atau file lokal, Anda harus mengekspor data ke format CSV atau JSON dan mengunggahnya manual ke jendela chat.
Dengan MCP, database lokal Anda berjalan sebagai MCP Server yang aman:
\`\`\`json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:pass@localhost:5432/db"]
    }
  }
}
\`\`\`
AI Agent kini bisa mengecek nama tabel, tipe data kolom, dan foreign key secara instan tanpa perlu Anda ketik berulang-ulang.`
          },
          {
            title: "BAB 4: Menyusun Agent Rules (AGENTS.md & .cursorrules)",
            content: `# BAB 4: Merancang Instruksi Agen Berkualitas Tinggi

AI Agent akan bekerja sesuai dengan batasan aturan yang Anda berikan. Tanpa aturan, AI cenderung menghasilkan kode berantakan atau memakai teknologi lama.

## File Panduan Konteks:
- AGENTS.md: Digunakan oleh agen modern (seperti Antigravity dan Claude Code) untuk membaca arsitektur dan larangan teknis.
- .cursorrules: Digunakan oleh Cursor IDE untuk mendikte standar kode setiap kali membuka proyek.

## Contoh Aturan Tegas:
\`\`\`markdown
# Aturan Rekayasa Next.js 16:
1. Utamakan React Server Components (RSC). Dilarang menggunakan use client kecuali ada event listener browser.
2. Dilarang menggunakan useEffect untuk sinkronisasi state data fetching.
3. Seluruh mutasi database wajib menggunakan Server Actions dengan validasi skema Zod.
\`\`\`
Dengan aturan ini, kode yang dihasilkan agen dijamin rapi, aman, dan siap produksi!`
          }
        ]
      }
    ]
  },

  // SEMESTER 1
  {
    semester: "Semester 1 • Fondasi Komputasi & Logika",
    courses: [
      {
        title: "Algoritma & Pemrograman Dasar",
        chapters: [
          {
            title: "BAB 1: Pengantar Algoritma dan Logika Komputasi",
            content: `# BAB 1: Pengantar Algoritma dan Logika Komputasi

Algoritma adalah urutan langkah logis yang disusun secara sistematis untuk menyelesaikan masalah komputasi. Tanpa algoritma yang efisien, perangkat keras tercanggih sekalipun tidak dapat memberikan hasil komputasi yang tepat.

## Ciri Algoritma yang Baik
1. Finiteness: Algoritma harus berhenti setelah mengerjakan sejumlah langkah terbatas.
2. Definiteness: Setiap langkah harus didefinisikan secara jelas dan tidak memiliki makna ganda.
3. Input: Memiliki nol atau lebih masukan data dari luar.
4. Output: Menghasilkan minimal satu keluaran yang merupakan solusi masalah.
5. Effectiveness: Setiap instruksi harus cukup sederhana sehingga dapat dikerjakan secara mekanik.

\`\`\`python
# Algoritma Sederhana: Menghitung Bilangan Faktorial Secara Rekursif
def faktorial(n):
    if n <= 1:
        return 1
    return n * faktorial(n - 1)

angka = 5
print(f"Faktorial dari {angka} adalah {faktorial(angka)}")
\`\`\``
          },
          {
            title: "BAB 2: Variabel, Tipe Data Primitif, dan Operator",
            content: `# BAB 2: Variabel dan Tipe Data Primitif

Variabel adalah lokasi penyimpanan di dalam memori komputer yang diberi nama pengenal dan dialokasikan untuk menyimpan nilai sementara selama eksekusi program.

## Klasifikasi Tipe Data Standar
- Integer: Tipe bilangan bulat tanpa pecahan, dialokasikan 4 byte dalam memori standar.
- Float: Tipe bilangan pecahan presisi tunggal atau ganda (IEEE 754).
- Boolean: Nilai logika biner yang hanya memiliki dua kemungkinan keadaan: True atau False.
- String: Kumpulan karakter berurutan yang dienkode dalam standar UTF-8 atau ASCII.

\`\`\`python
# Contoh Deklarasi Variabel dan Operasi Logika
nama_himpunan = "HIMASTI UMMAT"
tahun_berdiri = 2022
status_aktif = True
ipk_rata_rata = 3.85

print(f"Organisasi: {nama_himpunan} | Aktif: {status_aktif}")
\`\`\``
          },
          {
            title: "BAB 3: Struktur Percabangan dan Perulangan",
            content: `# BAB 3: Struktur Percabangan dan Perulangan

Alur eksekusi program tidak selalu linier dari atas ke bawah. Struktur kontrol memungkinkan program mengambil keputusan berdasarkan kondisi logika atau mengulang instruksi tertentu.

## 1. Percabangan Kondisional
Percabangan mengevaluasi ekspresi boolean. Jika kondisi bernilai benar, blok kode dieksekusi; jika salah, aliran program dialihkan ke blok alternatif.

## 2. Perulangan (Loops)
- For Loop: Digunakan ketika jumlah iterasi telah diketahui sebelumnya (counter-controlled).
- While Loop: Digunakan ketika perulangan bergantung pada kondisi tertentu yang bernilai benar (condition-controlled).

\`\`\`python
# Contoh Perulangan dan Percabangan Bersarang
kader_list = ["Budi", "Siti", "Ahmad", "Dewi", "Rian"]

for indeks, nama in enumerate(kader_list, start=1):
    if indeks % 2 == 0:
        print(f"Nomor {indeks}: {nama} (Kelompok Genap)")
    else:
        print(f"Nomor {indeks}: {nama} (Kelompok Ganjil)")
\`\`\``
          },
          {
            title: "BAB 4: Fungsi, Parameter, dan Modularisasi Kode",
            content: `# BAB 4: Fungsi dan Modularitas Kode

Fungsi adalah blok kode terisolasi yang dirancang untuk melakukan tugas spesifik. Prinsip utama rekayasa perangkat lunak adalah Don't Repeat Yourself (DRY), di mana fungsi membantu menghindari penulisan kode berulang.

## Parameter vs Argumen
- Parameter adalah variabel yang didefinisikan pada deklarasi fungsi.
- Argumen adalah nilai nyata yang dikirimkan ke dalam fungsi saat pemanggilan.

\`\`\`python
# Contoh Fungsi dengan Return Value dan Default Parameter
def hitung_nilai_akhir(tugas, uts, uas, bobot_tugas=0.3, bobot_uts=0.3, bobot_uas=0.4):
    nilai_akhir = (tugas * bobot_tugas) + (uts * bobot_uts) + (uas * bobot_uas)
    return round(nilai_akhir, 2)

skor_kader = hitung_nilai_akhir(85, 78, 90)
print(f"Nilai Akhir Akademik Kader: {skor_kader}")
\`\`\``
          }
        ]
      },
      {
        title: "Pengantar Teknologi Informasi",
        chapters: [
          {
            title: "BAB 1: Arsitektur Komputer dan Model Von Neumann",
            content: `# BAB 1: Arsitektur Komputer Modern

Arsitektur komputer modern hampir seluruhnya mengadopsi model Von Neumann yang dirumuskan pada tahun 1945.

## Komponen Inti Sistem Komputer
1. Central Processing Unit (CPU): Otak pemrosesan yang terdiri dari Arithmetic Logic Unit (ALU), Control Unit (CU), dan Register.
2. Memory Unit: Tempat penyimpanan instruksi dan data yang dapat diakses secara langsung oleh CPU (RAM).
3. Input Output Subsystem: Antarmuka yang menghubungkan komputer dengan perangkat periferal luar seperti papan ketik, layar, dan penyimpanan sekunder.
4. Bus Sistem: Jalur kabel komunikasi paralel yang mencakup Bus Data, Bus Alamat, dan Bus Kendali.`
          },
          {
            title: "BAB 2: Peran Sistem Operasi sebagai Manajer Sumber Daya",
            content: `# BAB 2: Konsep Dasar Sistem Operasi

Sistem Operasi (OS) bertindak sebagai perantara antara perangkat keras komputer dan aplikasi pengguna.

## Tugas Utama Sistem Operasi
- Manajemen Proses: Mengatur penjadwalan eksekusi instruksi pada inti CPU.
- Manajemen Memori: Mengalokasikan ruang RAM dan mencegah tumpang tindih data antar program.
- Manajemen Berkas: Mengatur hierarki penyimpanan file sistem (seperti ext4, NTFS, APFS).
- Keamanan dan Akses: Membatasi hak istimewa pengguna (User Space vs Kernel Space).`
          }
        ]
      },
      {
        title: "Matematika Diskrit",
        chapters: [
          {
            title: "BAB 1: Logika Proposisi dan Tabel Kebenaran",
            content: `# BAB 1: Logika Proposisi dalam Ilmu Komputer

Logika proposisi adalah fondasi dari sirkuit digital dan logika percabangan perangkat lunak.

## Operator Logika Dasar
- Konjungsi (AND): Bernilai benar hanya jika kedua proposisi bernilai benar.
- Disjungsi (OR): Bernilai benar jika salah satu atau kedua proposisi bernilai benar.
- Negasi (NOT): Membalikkan nilai kebenaran dari suatu proposisi.
- Implikasi (IF-THEN): Bernilai salah hanya jika premis bernilai benar namun konsekuen bernilai salah.
- Biimplikasi (IF AND ONLY IF): Bernilai benar jika kedua proposisi memiliki nilai kebenaran yang sama.`
          },
          {
            title: "BAB 2: Teori Himpunan dan Relasi Basis Data",
            content: `# BAB 2: Teori Himpunan dan Aljabar Relasional

Teori himpunan adalah dasar matematika dari Structured Query Language (SQL) dan sistem manajemen basis data relasional.

## Operasi Himpunan Utama
- Irisan (Intersection): Kumpulan elemen yang berada di kedua himpunan (diwakili klausa INNER JOIN).
- Gabungan (Union): Kumpulan semua elemen unik yang ada di salah satu atau kedua himpunan (diwakili klausa UNION).
- Selisih (Difference): Elemen yang berada di himpunan pertama namun tidak berada di himpunan kedua (diwakili klausa EXCEPT atau LEFT JOIN dengan filter NULL).`
          }
        ]
      }
    ]
  },

  // SEMESTER 2
  {
    semester: "Semester 2 • Struktur Data & Rekayasa Web",
    courses: [
      {
        title: "Struktur Data & Algoritma Lanjut",
        chapters: [
          {
            title: "BAB 1: Pointer Memori dan Alokasi Dinamis",
            content: `# BAB 1: Pointer Memori dan Alokasi Dinamis

Memori komputer dapat dibayangkan sebagai deretan kotak bernomor yang disebut alamat memori. Pointer adalah variabel khusus yang menyimpan alamat memori dari variabel lain.

## Stack vs Heap Memory
- Stack Memory: Memori berukuran terbatas yang dialokasikan secara otomatis untuk variabel lokal dan pemanggilan fungsi. Alokasi dan dealokasi terjadi sangat cepat secara LIFO.
- Heap Memory: Area memori berukuran besar yang dialokasikan secara dinamis saat program berjalan (runtime). Di bahasa seperti C/C++, programmer bertanggung jawab melepaskan memori heap untuk mencegah memory leak.

\`\`\`c
// Contoh Pointer dan Alokasi Memori Dinamis dalam C
#include <stdio.h>
#include <stdlib.h>

int main() {
    int *ptr = (int *)malloc(sizeof(int));
    if (ptr == NULL) {
        printf("Alokasi memori gagal!\\n");
        return 1;
    }
    *ptr = 2026;
    printf("Nilai data: %d, Alamat memori: %p\\n", *ptr, (void *)ptr);
    free(ptr);
    return 0;
}
\`\`\``
          },
          {
            title: "BAB 2: Linked List Tunggal dan Ganda",
            content: `# BAB 2: Struktur Data Linked List

Linked list adalah struktur data linier di mana setiap elemen (disebut Node) tidak disimpan pada lokasi memori yang bersebelahan seperti Array, melainkan dihubungkan melalui penunjuk (pointer).

## Keunggulan Linked List Dibanding Array
- Ukuran dinamis: Dapat bertambah atau berkurang sewaktu-waktu tanpa perlu realokasi memori besar.
- Penyisipan dan Penghapusan Efisien: Operasi insert dan delete di awal daftar memiliki kompleksitas O(1).

\`\`\`python
# Implementasi Singly Linked List dalam Python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_depan(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

daftar = LinkedList()
daftar.insert_depan("Kader HIMASTI 2024")
daftar.insert_depan("Kader HIMASTI 2025")
print(f"Node Terdepan: {daftar.head.data}")
\`\`\``
          },
          {
            title: "BAB 3: Stack (Tumpukan) dan Queue (Antrean)",
            content: `# BAB 3: Stack dan Queue

Stack dan Queue adalah dua tipe data abstrak yang sangat fundamental dalam komputasi.

## 1. Stack (LIFO - Last In First Out)
Elemen yang terakhir dimasukkan adalah elemen yang pertama dikeluarkan. Operasi utama: push (memasukkan), pop (mengeluarkan), dan peek (melihat elemen teratas). Digunakan pada fitur Undo/Redo dan Call Stack fungsi.

## 2. Queue (FIFO - First In First Out)
Elemen yang pertama dimasukkan adalah elemen yang pertama dikeluarkan. Operasi utama: enqueue (memasukkan ke belakang) dan dequeue (mengambil dari depan). Digunakan pada antrean pencetakan printer dan message broker.`
          },
          {
            title: "BAB 4: Pohon Biner dan Binary Search Tree (BST)",
            content: `# BAB 4: Pohon Biner dan Binary Search Tree (BST)

Tree adalah struktur data hierarkis non-linier yang terdiri dari simpul akar (root) dan simpul anak (child nodes).

## Aturan Binary Search Tree (BST)
- Nilai pada simpul anak kiri selalu lebih kecil dari nilai simpul induknya.
- Nilai pada simpul anak kanan selalu lebih besar dari nilai simpul induknya.
- Aturan ini memungkinkan pencarian data dengan kompleksitas rata-rata O(log n).

## Metode Kunjungan Pohon (Tree Traversal)
- In-Order: Kunjungi Kiri, Induk, Kanan (menghasilkan urutan data terurut naik).
- Pre-Order: Kunjungi Induk, Kiri, Kanan.
- Post-Order: Kunjungi Kiri, Kanan, Induk.`
          }
        ]
      },
      {
        title: "Pemrograman Web Modern",
        chapters: [
          {
            title: "BAB 1: Anatomi HTML5 Semantik dan CSS Modern",
            content: `# BAB 1: Fondasi Antarmuka Web Modern

Pembangunan web modern mengutamakan struktur semantik untuk meningkatkan aksesibilitas dan optimasi mesin pencari (SEO).

## Elemen Semantik HTML5
- header, nav, main, section, article, dan footer menggantikan penggunaan div tanpa makna semantik.
- Form Input terstandarisasi dengan validasi tipe bawaan peramban.

## Desain Responsif dengan Tailwind CSS
Penggunaan utility-first CSS seperti Tailwind menghilangkan kebutuhan penulisan CSS terpisah yang rawan konflik:
\`\`\`html
<div class="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center space-x-4">
  <div class="text-violet-600 font-bold text-lg">HIMASTI</div>
  <p class="text-slate-500 text-sm">Portal Resmi Mahasiswa Sistem & Teknologi Informasi</p>
</div>
\`\`\``
          },
          {
            title: "BAB 2: JavaScript Asynchronous, Promise, dan Fetch API",
            content: `# BAB 2: JavaScript Asynchronous dan Event Loop

JavaScript berjalan dalam lingkungan single-threaded, yang berarti ia hanya dapat menjalankan satu operasi dalam satu waktu. Untuk mencegah antarmuka membeku saat menunggu jaringan, JavaScript menggunakan model Asynchronous non-blocking.

## Evolusi Penanganan Asinkron
1. Callback: Rawan terjadi fenomena Callback Hell saat logika bersarang terlalu dalam.
2. Promise: Objek yang mewakili penyelesaian atau kegagalan operasi masa depan.
3. Async / Await: Sintaks modern yang membuat kode asinkron terbaca seperti kode sinkron linier.

\`\`\`javascript
// Contoh Fetch Data Menggunakan Async/Await
async function getDaftarKader() {
  try {
    const response = await fetch('/api/admin/kader');
    if (!response.ok) throw new Error('Jaringan bermasalah');
    const data = await response.json();
    console.log('Data Kader Berhasil Diambil:', data);
  } catch (error) {
    console.error('Error saat mengambil data:', error.message);
  }
}
\`\`\``
          }
        ]
      }
    ]
  },

  // SEMESTER 3
  {
    semester: "Semester 3 • Paradigma Objek & Rekayasa Data",
    courses: [
      {
        title: "Pemrograman Berorientasi Objek (PBO)",
        chapters: [
          {
            title: "BAB 1: Enkapsulasi, Kelas, dan Objek",
            content: `# BAB 1: Paradigma Berorientasi Objek (OOP)

OOP mengorganisasikan perangkat lunak sebagai kumpulan objek yang saling berinteraksi, memadukan data (atribut) dan perilaku (metode) dalam satu kesatuan.

## 4 Pilar Utama OOP
1. Enkapsulasi: Menyembunyikan rincian internal objek dan hanya memperlihatkan antarmuka publik yang aman menggunakan penentu akses (public, private, protected).
2. Abstraksi: Memfokuskan perhatian pada apa yang dilakukan objek, bukan bagaimana cara kerjanya secara mendalam.
3. Pewarisan: Mekanisme kelas anak mewarisi atribut dan metode kelas induk.
4. Polimorfisme: Kemampuan satu antarmuka untuk mengeksekusi perilaku yang berbeda sesuai konteks objek.

\`\`\`typescript
// Contoh Enkapsulasi dan TypeScript Class
class Mahasiswa {
  private _nim: string;
  public nama: string;

  constructor(nim: string, nama: string) {
    this._nim = nim;
    this.nama = nama;
  }

  public getNim(): string {
    return this._nim;
  }
}

const kader = new Mahasiswa("2024001", "Ahmad Fauzi");
console.log(kader.nama, kader.getNim());
\`\`\``
          },
          {
            title: "BAB 2: Pewarisan dan Polimorfisme Dinamis",
            content: `# BAB 2: Pewarisan dan Polimorfisme Dinamis

Pewarisan memungkinkan pembuatan hierarki kelas yang logis dan meningkatkan penggunaan ulang kode (code reusability).

## Method Overriding vs Overloading
- Method Overriding: Kelas anak menyediakan implementasi baru untuk metode yang sudah ada di kelas induknya.
- Method Overloading: Menulis beberapa metode dengan nama yang sama di satu kelas namun memiliki daftar parameter berbeda.

\`\`\`typescript
abstract class AnggotaHimpunan {
  abstract hakAkses(): string;
}

class KaderAktif extends AnggotaHimpunan {
  hakAkses(): string {
    return "Akses modul dan presensi acara";
  }
}

class PengurusInti extends AnggotaHimpunan {
  hakAkses(): string {
    return "Akses penuh manajemen kas, surat, dan administrasi";
  }
}
\`\`\``
          }
        ]
      },
      {
        title: "Sistem Basis Data Relasional",
        chapters: [
          {
            title: "BAB 1: Normalisasi Basis Data (1NF, 2NF, 3NF)",
            content: `# BAB 1: Teori Normalisasi Basis Data

Normalisasi adalah teknik analisis data yang mengorganisasikan tabel untuk mengurangi redundansi data dan mencegah anomali modifikasi (Insert, Update, Delete Anomaly).

## Bentuk Normal Utama
1. First Normal Form (1NF): Setiap sel tabel harus berisi nilai atomik tunggal, dan tidak ada kolom yang berulang.
2. Second Normal Form (2NF): Memenuhi 1NF dan setiap atribut non-kunci harus bergantung sepenuhnya pada kunci primer (No Partial Dependency).
3. Third Normal Form (3NF): Memenuhi 2NF dan tidak boleh ada atribut non-kunci yang bergantung pada atribut non-kunci lainnya (No Transitive Dependency).`
          },
          {
            title: "BAB 2: SQL Lanjut, JOIN, dan Transaksi ACID",
            content: `# BAB 2: SQL Lanjut dan Prinsip Transaksi ACID

Dalam sistem basis data produksi, integritas data dijamin melalui 4 pilar transaksi yang dikenal sebagai ACID.

## Prinsip ACID
- Atomicity: Seluruh perintah dalam transaksi harus berhasil dieksekusi secara keseluruhan. Jika ada satu perintah gagal, seluruh perubahan dibatalkan (Rollback).
- Consistency: Transaksi harus mempertahankan integritas batasan basis data.
- Isolation: Transaksi yang berjalan paralel tidak boleh saling mengganggu sebelum selesai di-commit.
- Durability: Data yang telah berhasil di-commit akan tersimpan permanen di media disk dan tidak akan hilang meski terjadi pemadaman server.

\`\`\`sql
-- Contoh Transaksi Perbankan SQL yang Atomik
BEGIN TRANSACTION;
UPDATE rekening SET saldo = saldo - 50000 WHERE id = 1;
UPDATE rekening SET saldo = saldo + 50000 WHERE id = 2;
INSERT INTO riwayat_transfer (pengirim_id, penerima_id, nominal) VALUES (1, 2, 50000);
COMMIT;
\`\`\``
          }
        ]
      }
    ]
  },

  // SEMESTER 4
  {
    semester: "Semester 4 • Jaringan & Rekayasa Perangkat Lunak",
    courses: [
      {
        title: "Jaringan Komputer & Protokol Internet",
        chapters: [
          {
            title: "BAB 1: Model 7 Lapis OSI vs TCP/IP",
            content: `# BAB 1: Arsitektur Protokol Jaringan

Komunikasi jaringan antar komputer di seluruh dunia distandarisasi melalui model referensi arsitektur protokol.

## 7 Lapis OSI Model (Open Systems Interconnection)
1. Physical: Transmisi bit mentah melalui media fisik kabel atau gelombang radio.
2. Data Link: Pengalamatan perangkat keras lokal menggunakan MAC Address (Ethernet, Wi-Fi).
3. Network: Pengalamatan logis dan pemilihan rute terbaik paket data (Protokol IP, ICMP).
4. Transport: Pengiriman data end-to-end dengan keandalan (TCP) atau kecepatan tinggi (UDP).
5. Session: Pembentukan, pengelolaan, dan penutupan sesi komunikasi antar aplikasi.
6. Presentation: Enkripsi, kompresi, dan translasi format data (TLS/SSL, JSON, JPEG).
7. Application: Antarmuka langsung ke aplikasi perangkat lunak pengguna (HTTP, SSH, DNS).`
          },
          {
            title: "BAB 2: Pengalamatan IPv4, Subnetting CIDR, dan DNS",
            content: `# BAB 2: Pengalamatan IP dan Subnetting

Alamat IP adalah pengenal unik numerik untuk setiap perangkat yang terhubung ke jaringan internet.

## Konsep Subnetting (CIDR)
Subnetting memecah jaringan fisik besar menjadi beberapa sub-jaringan logis yang lebih kecil untuk meningkatkan efisiensi alokasi alamat dan memperkuat isolasi keamanan.

## Cara Kerja Domain Name System (DNS)
Komputer berkomunikasi menggunakan angka IP (seperti 104.21.32.1), namun manusia lebih mudah mengingat nama domain (seperti himasti.org). DNS bertindak sebagai buku telepon global yang menerjemahkan nama domain menjadi alamat IP melalui rekursif DNS Resolver.`
          }
        ]
      },
      {
        title: "Rekayasa Perangkat Lunak (RPL)",
        chapters: [
          {
            title: "BAB 1: Metodologi Agile Scrum dan Clean Architecture",
            content: `# BAB 1: Metodologi Rekayasa Perangkat Lunak

Pengembangan perangkat lunak modern telah bergeser dari model tradisional Waterfall yang kaku menuju model Agile yang adaptif terhadap perubahan kebutuhan pengguna.

## Siklus Agile Scrum
- Sprint: Siklus kerja berulang yang biasanya berdurasi 1 hingga 4 minggu untuk merilis fitur yang dapat berfungsi (Inkrementasi).
- Daily Standup: Rapat singkat 15 menit setiap hari untuk menyelaraskan progress tim dan mengidentifikasi kendala teknis.
- Retrospective: Evaluasi di akhir sprint untuk meningkatkan efisiensi dan kualitas kerja tim.`
          },
          {
            title: "BAB 2: Prinsip Desain SOLID untuk Kode yang Skalabel",
            content: `# BAB 2: Prinsip Desain SOLID

Prinsip SOLID dirumuskan oleh Robert C. Martin (Uncle Bob) untuk menghasilkan kode yang mudah dipelihara, diuji, dan dikembangkan.

## 5 Prinsip SOLID
1. Single Responsibility Principle (SRP): Suatu modul atau kelas hanya boleh memiliki satu alasan untuk berubah.
2. Open Closed Principle (OCP): Entitas perangkat lunak harus terbuka untuk ekstensi fitur, namun tertutup untuk modifikasi kode inti yang sudah berjalan.
3. Liskov Substitution Principle (LSP): Objek dari kelas induk harus dapat digantikan dengan objek kelas turunannya tanpa merusak kebenaran program.
4. Interface Segregation Principle (ISP): Klien tidak boleh dipaksa bergantung pada antarmuka metode yang tidak mereka gunakan.
5. Dependency Inversion Principle (DIP): Modul tingkat tinggi tidak boleh bergantung pada modul tingkat rendah; keduanya harus bergantung pada abstraksi.`
          }
        ]
      }
    ]
  },

  // SEMESTER 5
  {
    semester: "Semester 5 • Keamanan Siber & Rekayasa Cloud",
    courses: [
      {
        title: "Keamanan Siber & Kriptografi",
        chapters: [
          {
            title: "BAB 1: Kriptografi Kunci Simetris AES vs Asimetris RSA",
            content: `# BAB 1: Fondasi Kriptografi Modern

Kriptografi adalah ilmu menyamarkan informasi agar hanya pihak yang berwenang yang dapat membaca dan memverifikasi keaslian pesan tersebut.

## 1. Kriptografi Kunci Simetris (Contoh: AES-256)
Menggunakan satu kunci rahasia yang sama untuk proses enkripsi dan dekripsi. Sangat efisien dan berkinerja tinggi, cocok untuk mengenkripsi volume data besar di penyimpanan disk.

## 2. Kriptografi Kunci Asimetris (Contoh: RSA, ECC)
Menggunakan sepasang kunci: Kunci Publik (disebarkan bebas untuk enkripsi) dan Kunci Privat (dirahasiakan rapat untuk dekripsi). Menjadi fondasi keamanan HTTPS (TLS), SSH, dan Tanda Tangan Digital.`
          },
          {
            title: "BAB 2: Hashing Kriptografis, Salt, dan Arsitektur Zero-Trust",
            content: `# BAB 2: Hashing Kata Sandi dan Model Zero-Trust

Berbeda dengan enkripsi yang dapat dibalikkan (dekripsi), Hashing adalah fungsi matematika satu arah yang memetakan data berukuran sembarang menjadi intisari data (digest) berukuran tetap.

## Keamanan Penyimpanan Kata Sandi
Kata sandi tidak boleh disimpan dalam teks mentah (plaintext). Standar industri menggunakan algoritma hashing lambat yang tahan terhadap serangan GPU, seperti bcrypt atau Argon2, dengan menambahkan garam acak (Salt) untuk menggagalkan serangan Rainbow Table.

## Prinsip Arsitektur Zero-Trust
Prinsip Zero-Trust berakar pada semboyan: "Never Trust, Always Verify". Setiap permintaan akses ke sumber daya sistem, baik dari dalam maupun luar jaringan, wajib diautentikasi dan diotorisasi secara terus-menerus.`
          }
        ]
      },
      {
        title: "Komputasi Awan (Cloud Computing) & Docker",
        chapters: [
          {
            title: "BAB 1: Virtualisasi vs Containerization dengan Docker",
            content: `# BAB 1: Revolusi Kontainer dan Docker

Sebelum hadirnya kontainer, pengembang sering mengeluhkan masalah: "Aplikasi ini berjalan lancar di komputer saya, tapi error saat dijalankan di server!"

## Perbedaan Virtual Machine vs Docker
- Virtual Machine (VM): Menjalankan seluruh sistem operasi tamu (Guest OS) di atas Hypervisor. Membutuhkan memori besar (gigabyte) dan waktu booting menit.
- Docker Container: Mengisolasi aplikasi pada tingkat proses dengan berbagi kernel sistem operasi induk. Ringan (megabyte), efisien, dan dapat dijalankan dalam hitungan detik.`
          },
          {
            title: "BAB 2: Arsitektur Microservices dan Cloud Native",
            content: `# BAB 2: Arsitektur Monolitik vs Microservices

Dalam arsitektur monolitik, seluruh fitur aplikasi dibangun dalam satu basis kode tunggal. Jika satu modul mengalami kegagalan, seluruh sistem berisiko tumbang.

## Karakteristik Microservices
- Pecahan Layanan Independen: Setiap layanan menangani domain bisnis tertentu (misal: Layanan Autentikasi, Layanan Pembayaran, Layanan Katalog).
- Basis Data Terpisah: Setiap microservice memiliki basis data sendiri untuk mencegah kopling ketat.
- Komunikasi Jaringan Ringan: Layanan saling berkomunikasi menggunakan REST API, gRPC, atau Message Broker seperti RabbitMQ.`
          }
        ]
      }
    ]
  },

  // SEMESTER 6
  {
    semester: "Semester 6 • Sistem Terdistribusi & DevOps",
    courses: [
      {
        title: "Sistem Terdistribusi Skala Masif",
        chapters: [
          {
            title: "BAB 1: Teorema CAP dan Konsistensi Data",
            content: `# BAB 1: Teorema CAP dalam Sistem Terdistribusi

Sistem terdistribusi adalah kumpulan komputer otonom yang terhubung melalui jaringan dan bekerja sama sehingga tampak oleh pengguna sebagai satu sistem komputer terpadu.

## Teorema CAP (Brewer's Theorem)
Dalam sistem data terdistribusi yang mengalami kegagalan jaringan (Partition), sistem hanya dapat memilih salah satu di antara dua jaminan:
1. Consistency (C): Setiap pembacaan menerima penulisan data paling mutakhir atau menghasilkan pesan error.
2. Availability (A): Setiap permintaan yang tidak bermasalah selalu menerima respons tanpa jaminan bahwa data tersebut adalah versi paling mutakhir.
3. Partition Tolerance (P): Sistem tetap berfungsi meskipun ada gangguan komunikasi paket jaringan antar simpul server.`
          },
          {
            title: "BAB 2: Message Broker dan Event-Driven Architecture",
            content: `# BAB 2: Komunikasi Asinkron dengan Event-Driven

Dalam sistem skala jutaan pengguna, pemanggilan API HTTP sinkron antar server dapat memicu kemacetan (bottleneck).

## Peran Message Broker
Message broker (seperti Apache Kafka atau RabbitMQ) bertindak sebagai penyangga antrean pesan yang menghubungkan produsen pesan (Producer) dan konsumen data (Consumer). Jika server konsumen sedang sibuk, pesan tetap aman tersimpan di antrean broker tanpa membebani server produsen.`
          }
        ]
      },
      {
        title: "DevOps & Otomasi CI/CD",
        chapters: [
          {
            title: "BAB 1: Pipa Otomasi Continuous Integration dan Deployment (CI/CD)",
            content: `# BAB 1: Praktik DevOps dan Otomasi Pipeline

DevOps adalah gabungan filosofi budaya, praktik, dan perkakas yang meningkatkan kemampuan organisasi untuk merilis aplikasi dengan kecepatan dan keandalan tinggi.

## Alur Pipeline CI/CD Modern
1. Code: Pengembang mendorong perubahan kode ke repositori GitHub.
2. Build & Lint: Server otomatis memeriksa sintaks dan mengompilasi kode.
3. Automated Test: Menjalankan rangkaian unit test dan integration test.
4. Security Scan: Memindai celah ketergantungan paket perangkat lunak.
5. Deploy: Mengunggah artefak aplikasi ke lingkungan produksi (seperti Vercel atau Kubernetes) secara otomatis tanpa intervensi manual.`
          }
        ]
      }
    ]
  },

  // SEMESTER 7
  {
    semester: "Semester 7 • Riset, Skripsi, & Tata Kelola IT",
    courses: [
      {
        title: "Metodologi Penelitian TI & Skripsi",
        chapters: [
          {
            title: "BAB 1: Merumuskan Masalah Ilmiah dan State of the Art",
            content: `# BAB 1: Fondasi Penelitian Ilmiah Bidang Teknologi Informasi

Penelitian tugas akhir (skripsi) mahasiswa IT bukan sekadar membuat program aplikasi biasa, melainkan memecahkan permasalahan ilmiah yang terukur melalui metode komputasi yang sahih.

## Unsur Masalah Penelitian yang Baik
- Novelty (Kebaruan): Memiliki kontribusi atau sudut pandang baru yang membedakannya dari penelitian sebelumnya.
- Measurable (Terukur): Memiliki metrik evaluasi yang jelas (seperti Akurasi, Latensi, Presisi, atau Efisiensi Memori).
- State of the Art: Melakukan telaah terhadap jurnal ilmiah mutakhir (IEEE, ACM, SINTA) dalam 5 tahun terakhir untuk mengetahui batas capaian riset terkini.`
          },
          {
            title: "BAB 2: Desain Eksperimen dan Pengujian Hipotesis",
            content: `# BAB 2: Desain Eksperimen dan Validasi Ilmiah

Suatu klaim ilmiah harus dapat diuji ulang secara independen oleh peneliti lain (Reproducibility).

## Metode Validasi Standar Komputasi
- K-Fold Cross Validation: Menguji generalisasi model machine learning pada berbagai variasi subset data.
- Confusion Matrix: Menghitung metrik evaluasi performa klasifikasi (Precision, Recall, F1-Score).
- A/B Testing: Membandingkan performa dua algoritma atau arsitektur sistem pada beban kerja nyata.`
          }
        ]
      },
      {
        title: "Tata Kelola TI & Manajemen Proyek",
        chapters: [
          {
            title: "BAB 1: Kerangka Kerja Tata Kelola COBIT dan ITIL",
            content: `# BAB 1: Tata Kelola Teknologi Informasi Perusahaan

Investasi teknologi informasi dalam organisasi harus selaras dengan tujuan strategis institusi.

## Kerangka Kerja Utama
- COBIT (Control Objectives for Information and Related Technologies): Berfokus pada tata kelola tingkat enterprise, audit kepatuhan, dan manajemen risiko TI.
- ITIL (Information Technology Infrastructure Library): Berfokus pada penyampaian dan pengelolaan layanan operasional TI (Service Desk, Incident Management, Change Management).`
          }
        ]
      }
    ]
  }
];
