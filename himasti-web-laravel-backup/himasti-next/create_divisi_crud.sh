# ==========================================
# 1. SURVEY
# ==========================================
mkdir -p src/app/admin/survey
cat << 'INNER' > src/app/admin/survey/page.tsx
import { prisma } from "@/lib/prisma";
import SurveyClient from "./SurveyClient";
export const dynamic = "force-dynamic";

export default async function SurveyPage() {
  const data = await prisma.survey.findMany({ orderBy: { created_at: 'desc' } });
  return <SurveyClient records={data} />;
}
INNER
cat << 'INNER' > src/app/admin/survey/actions.ts
"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addSurvey(formData: FormData) {
  try {
    await prisma.survey.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        status: formData.get("status") as string,
      }
    });
    revalidatePath("/admin/survey");
    return { success: true };
  } catch (e) { return { success: false, error: "Gagal menambah survey" }; }
}

export async function deleteSurvey(id: number) {
  try {
    await prisma.survey.delete({ where: { id } });
    revalidatePath("/admin/survey");
    return { success: true };
  } catch (e) { return { success: false, error: "Gagal menghapus survey" }; }
}
INNER
cat << 'INNER' > src/app/admin/survey/SurveyClient.tsx
"use client";
import { useState } from "react";
import { addSurvey, deleteSurvey } from "./actions";

export default function SurveyClient({ records }: { records: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    const result = await addSurvey(new FormData(e.target));
    if (result.success) setIsOpen(false);
    else alert(result.error);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b flex justify-between">
          <h2 className="text-xl font-bold dark:text-white">Riset & Kuesioner</h2>
          <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">+ Buat Kuesioner</button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {records.map(r => (
            <div key={r.id} className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900 flex justify-between">
              <div>
                <span className={`text-xs px-2 py-1 rounded-full mb-2 inline-block ${r.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>{r.status}</span>
                <h3 className="font-bold text-lg dark:text-white">{r.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{r.description}</p>
              </div>
              <div><button onClick={() => deleteSurvey(r.id)} className="text-red-500 text-sm">Hapus</button></div>
            </div>
          ))}
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Buat Kuesioner</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="title" required placeholder="Judul Kuesioner" className="w-full p-2 border rounded" />
              <textarea name="description" required placeholder="Tujuan Kuesioner & Link GForm" className="w-full p-2 border rounded" rows={3}></textarea>
              <select name="status" className="w-full p-2 border rounded">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
INNER

# ==========================================
# 2. KLUB
# ==========================================
mkdir -p src/app/admin/klub
cat << 'INNER' > src/app/admin/klub/page.tsx
import { prisma } from "@/lib/prisma";
import KlubClient from "./KlubClient";
export const dynamic = "force-dynamic";

export default async function KlubPage() {
  const data = await prisma.klub.findMany({ orderBy: { created_at: 'desc' } });
  return <KlubClient records={data} />;
}
INNER
cat << 'INNER' > src/app/admin/klub/actions.ts
"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addKlub(formData: FormData) {
  try {
    await prisma.klub.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
      }
    });
    revalidatePath("/admin/klub");
    return { success: true };
  } catch (e) { return { success: false, error: "Gagal menambah klub" }; }
}

export async function deleteKlub(id: number) {
  try {
    await prisma.klub.delete({ where: { id } });
    revalidatePath("/admin/klub");
    return { success: true };
  } catch (e) { return { success: false, error: "Gagal menghapus klub" }; }
}
INNER
cat << 'INNER' > src/app/admin/klub/KlubClient.tsx
"use client";
import { useState } from "react";
import { addKlub, deleteKlub } from "./actions";

export default function KlubClient({ records }: { records: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    const result = await addKlub(new FormData(e.target));
    if (result.success) setIsOpen(false);
    else alert(result.error);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b flex justify-between">
          <h2 className="text-xl font-bold dark:text-white">Klub IT & Minat Bakat</h2>
          <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">+ Tambah Klub</button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {records.map(r => (
            <div key={r.id} className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-900 flex justify-between">
              <div>
                <h3 className="font-bold text-lg dark:text-white">{r.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{r.description}</p>
              </div>
              <div><button onClick={() => deleteKlub(r.id)} className="text-red-500 text-sm">Hapus</button></div>
            </div>
          ))}
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Tambah Klub Baru</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="title" required placeholder="Nama Klub (Misal: Programming Club)" className="w-full p-2 border rounded" />
              <textarea name="description" required placeholder="Deskripsi & Jadwal Latihan" className="w-full p-2 border rounded" rows={3}></textarea>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
INNER

# ==========================================
# 3. MERCHANDISE
# ==========================================
mkdir -p src/app/admin/merchandise
cat << 'INNER' > src/app/admin/merchandise/page.tsx
import { prisma } from "@/lib/prisma";
import MerchClient from "./MerchClient";
export const dynamic = "force-dynamic";

export default async function MerchPage() {
  const data = await prisma.merchandise.findMany({ orderBy: { created_at: 'desc' } });
  return <MerchClient records={data} />;
}
INNER
cat << 'INNER' > src/app/admin/merchandise/actions.ts
"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addMerch(formData: FormData) {
  try {
    await prisma.merchandise.create({
      data: {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
      }
    });
    revalidatePath("/admin/merchandise");
    return { success: true };
  } catch (e) { return { success: false, error: "Gagal menambah produk" }; }
}

export async function deleteMerch(id: number) {
  try {
    await prisma.merchandise.delete({ where: { id } });
    revalidatePath("/admin/merchandise");
    return { success: true };
  } catch (e) { return { success: false, error: "Gagal menghapus produk" }; }
}
INNER
cat << 'INNER' > src/app/admin/merchandise/MerchClient.tsx
"use client";
import { useState } from "react";
import { addMerch, deleteMerch } from "./actions";

export default function MerchClient({ records }: { records: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    const result = await addMerch(new FormData(e.target));
    if (result.success) setIsOpen(false);
    else alert(result.error);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="p-6 border-b flex justify-between">
          <h2 className="text-xl font-bold dark:text-white">Katalog Merchandise (Danus)</h2>
          <button onClick={() => setIsOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">+ Tambah Produk</button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {records.map(r => (
            <div key={r.id} className="border rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 shadow-sm">
              <div className="h-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">PDIH (Gambar Belum)</div>
              <div className="p-4">
                <h3 className="font-bold text-lg dark:text-white">{r.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{r.description}</p>
                <button onClick={() => deleteMerch(r.id)} className="text-red-500 text-xs font-semibold w-full text-right border-t pt-3 mt-3">Hapus Produk</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4 dark:text-white">Tambah Produk Danus</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="title" required placeholder="Nama Produk (Misal: Kaos PDH)" className="w-full p-2 border rounded" />
              <textarea name="description" required placeholder="Deskripsi & Harga" className="w-full p-2 border rounded" rows={3}></textarea>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
INNER
