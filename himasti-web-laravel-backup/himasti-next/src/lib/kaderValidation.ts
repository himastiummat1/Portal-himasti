/**
 * HIMASTI Cadre Registry & NIM Authentication
 * Digunakan untuk otentikasi login instan berbasis NIM untuk kader terdaftar.
 */

export interface VerifiedKaderItem {
  no: number;
  nama: string;
  nim: string;
  email: string;
  angkatan: string;
  status: "Terverifikasi";
  notes?: string;
}

export const LIST_VERIFIED_KADER: VerifiedKaderItem[] = [
  { no: 1, nama: "Iin Supriyanti", nim: "20240410510020", email: "iinsuprianti6@gmail.com", angkatan: "2024", status: "Terverifikasi" },
  { no: 2, nama: "Riska Yulianti Putri", nim: "20240410510056", email: "riska.yulianti@kader.himasti.org", angkatan: "2024", status: "Terverifikasi" },
  { no: 3, nama: "Adi Supriyadi", nim: "20240410510002", email: "adi.supriyadi@kader.himasti.org", angkatan: "2024", status: "Terverifikasi" },
  { no: 4, nama: "Nurhayati", nim: "30240410510082", email: "nurhayati@kader.himasti.org", angkatan: "2024", status: "Terverifikasi", notes: "Alias: 20240410510082" },
  { no: 5, nama: "Ikhtiardin", nim: "20230410500029", email: "ikhtiardin@kader.himasti.org", angkatan: "2023", status: "Terverifikasi" },
  { no: 6, nama: "Raodatul Fidaris", nim: "20240410510052", email: "fidarisraodatul@gmail.com", angkatan: "2024", status: "Terverifikasi" },
  { no: 7, nama: "Iga Indrawati", nim: "20240410510018", email: "igaindrawati2@gmail.com", angkatan: "2024", status: "Terverifikasi" },
  { no: 8, nama: "Suci Wati", nim: "20240410510077", email: "sw2877857@gmail.com", angkatan: "2024", status: "Terverifikasi" },
  { no: 9, nama: "Andi Firmansyah", nim: "20240410500003", email: "aandifirmansyah586@gmail.com", angkatan: "2024", status: "Terverifikasi", notes: "Updated from 202022" },
  { no: 10, nama: "Putri Dwi Cahyani", nim: "20240410510076", email: "putridc090306@gmail.com", angkatan: "2024", status: "Terverifikasi" },
  { no: 11, nama: "Nabila Dhiya Zahra", nim: "20240410510045", email: "nabilazahra5555@gmail.com", angkatan: "2024", status: "Terverifikasi" },
  { no: 12, nama: "Dinda Safira Lestari", nim: "20240410510014", email: "dindasyarif05@gmail.com", angkatan: "2024", status: "Terverifikasi", notes: "Alias: 2024010510014" },
  { no: 13, nama: "Tegar Ahmad", nim: "20240410510064", email: "igar8519@gmail.com", angkatan: "2024", status: "Terverifikasi" },
  { no: 14, nama: "Fadilatul Azizah", nim: "20240410510015", email: "fadilatul.azizah@kader.himasti.org", angkatan: "2024", status: "Terverifikasi" },
  { no: 15, nama: "M. Rifky Wauzlah", nim: "20240410510028", email: "jamesrifky94@gmail.com", angkatan: "2024", status: "Terverifikasi" },
  { no: 16, nama: "Ana Ulfairah", nim: "20240410510007", email: "ana.ulfairah@kader.himasti.org", angkatan: "2024", status: "Terverifikasi" },
  { no: 17, nama: "Abi Abdillah", nim: "20240410500002", email: "abi.abdillah@kader.himasti.org", angkatan: "2024", status: "Terverifikasi" },
  { no: 18, nama: "Rasikhun Auliya", nim: "20240410510053", email: "rasikhunauliya@gmail.com", angkatan: "2024", status: "Terverifikasi" },
  { no: 19, nama: "Muhammad Aswin", nim: "20240410510036", email: "muhammad.aswin@kader.himasti.org", angkatan: "2024", status: "Terverifikasi" },
  { no: 20, nama: "M FAUJAN", nim: "20240410510024", email: "m.faujan@kader.himasti.org", angkatan: "2024", status: "Terverifikasi" },
  { no: 21, nama: "Junizar Maulana", nim: "20240410510022", email: "junizarml20@gmail.com", angkatan: "2024", status: "Terverifikasi" },
];

// Alias untuk kompatibilitas ke belakang
export const LIST_18_KADER = LIST_VERIFIED_KADER;

/**
 * Peta alias untuk toleransi salah ketik NIM
 */
export const NIM_ALIASES: Record<string, string> = {
  "2024010510014": "20240410510014", // Dinda Safira Lestari (13-digit typo)
  "20240410510082": "30240410510082", // Nurhayati alternate
  "30240410510082": "30240410510082",
  "202022": "20240410500003", // Andi Firmansyah legacy
  "20240410500002": "20240410500002", // Abi Abdillah
  "fadilatul": "20240410510015",
  "fadilatul azizah": "20240410510015",
};

/**
 * Normalisasi NIM atau identifier masukan pengguna
 */
export function resolveNim(input: string): string {
  if (!input) return "";
  const clean = input.trim().toLowerCase();
  return NIM_ALIASES[clean] || input.trim();
}

/**
 * Periksa apakah identifier (NIM atau Email) berhak login cepat dengan NIM
 */
export function is18VerifiedKader(nimOrIdentifier?: string | null): boolean {
  if (!nimOrIdentifier) return false;
  const raw = nimOrIdentifier.trim();
  const target = resolveNim(raw).toLowerCase();
  const rawLower = raw.toLowerCase();

  return LIST_VERIFIED_KADER.some(k => 
    k.nim.toLowerCase() === target ||
    k.nim.toLowerCase() === rawLower ||
    k.email.toLowerCase() === rawLower ||
    (k.notes && k.notes.toLowerCase().includes(rawLower))
  );
}

export const isNIMLoginEligible = is18VerifiedKader;

/**
 * Ambil detail kader dari daftar kader terverifikasi
 */
export function get18KaderDetail(nimOrIdentifier?: string | null): VerifiedKaderItem | undefined {
  if (!nimOrIdentifier) return undefined;
  const raw = nimOrIdentifier.trim();
  const target = resolveNim(raw).toLowerCase();
  const rawLower = raw.toLowerCase();

  return LIST_VERIFIED_KADER.find(k => 
    k.nim.toLowerCase() === target ||
    k.nim.toLowerCase() === rawLower ||
    k.email.toLowerCase() === rawLower ||
    (k.notes && k.notes.toLowerCase().includes(rawLower))
  );
}
