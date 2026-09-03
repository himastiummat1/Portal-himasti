import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfilClient from "./ProfilClient";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div className="p-8 m-4 bg-red-50 border border-red-200 rounded-lg text-red-600 font-bold">Terjadi kesalahan: Sesi Anda hilang. Silakan logout dan login kembali.</div>;
  }

  const userId = typeof session.user.id === 'string' ? parseInt(session.user.id) : Number(session.user.id);

  if (isNaN(userId)) {
    return <div className="p-8 m-4 bg-red-50 border border-red-200 rounded-lg text-red-600 font-bold">Terjadi kesalahan: ID Sesi tidak valid (NaN). Silakan logout dan login kembali.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      data_kader: true,
      roles: { include: { role: true } }
    }
  });

  if (!user) {
    return <div className="p-8 m-4 bg-red-50 border border-red-200 rounded-lg text-red-600 font-bold">Terjadi kesalahan: Data Pengguna (ID: {userId}) tidak ditemukan di Database.</div>;
  }

  // SAFE transform roles to a readable format (handle null roles if DB is corrupted)
  const roleNames = (user.roles || [])
    .filter(r => r && r.role && r.role.name)
    .map(r => r.role.name.replace(/_/g, ' ').toUpperCase())
    .join(', ');

  const isSuperAdmin = (user.roles || []).some(r => r && r.role && r.role.name === 'super_admin');

  const profileData = {
    id: user.id,
    name: user.name,
    email: user.email,
    nim: user.data_kader?.nim || "-",
    angkatan: user.data_kader?.angkatan || "-",
    no_hp: user.data_kader?.no_hp || "",
    jenis_kelamin: user.data_kader?.jenis_kelamin || "",
    status_kaderisasi: user.data_kader?.status_kaderisasi || "-",
    roles: roleNames || "KADER",
    isSuperAdmin,
    xp: user.data_kader?.xp ?? 50,
    custom_frame: user.data_kader?.custom_frame || "none",
    custom_title: user.data_kader?.custom_title || "kader",
    custom_theme: user.data_kader?.custom_theme || "default",
    custom_name_effect: user.data_kader?.custom_name_effect || "plain",
    solved_challenges: user.data_kader?.solved_challenges ? JSON.parse(user.data_kader.solved_challenges) : []
  };

  return <ProfilClient initialData={profileData} />;
}
