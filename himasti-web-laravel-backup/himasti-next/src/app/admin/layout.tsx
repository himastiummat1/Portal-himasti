import { ReactNode } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import TopNav from "@/components/layout/TopNav";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getDict } from "./../i18n";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const dict = await getDict();
  if (!session?.user) redirect("/login");
  
  let userRoles: string[] = [];
  if (session.user.id) {
    const rolesData = await prisma.modelHasRole.findMany({
      where: { model_id: parseInt(session.user.id) },
      include: { role: true }
    });
    userRoles = rolesData.map(r => r.role.name);

    // Cek apakah user baru login dengan Google dan belum setel data
    const kader = await prisma.dataKader.findUnique({
      where: { user_id: parseInt(session.user.id) }
    });
    if (kader?.nim?.startsWith("GGL-")) {
      redirect("/onboarding");
    }
  }

  const isSuperAdmin = userRoles.includes('super_admin');
  const isKetuaOrWakil = userRoles.some(r => r === 'ketua_himpunan' || r === 'wakil_ketua' || r === 'wakil_ketua_himpunan' || (r.includes('ketua') && !r.includes('bidang')));
  const isSekretaris = userRoles.some(r => r.includes('sekretaris'));
  const isBendahara = userRoles.some(r => r.includes('bendahara'));

  // Semua Ketua Bidang (kabid_*) dan Anggota Bidang (anggota_*) diberikan HAK AKSES YANG SETARA
  const isKabid = userRoles.some(r => r.includes('kabid') || r.includes('ketua_bidang'));
  const isAnggotaBidang = userRoles.some(r => r.includes('anggota') || r.includes('panitia'));
  const isStaffBidang = isKabid || isAnggotaBidang;

  // Tingkatan Pengurus
  const isBPHKhusus = isSuperAdmin || isKetuaOrWakil || isSekretaris || isBendahara;
  const isAllPengurus = isBPHKhusus || isStaffBidang;

  // 1. Hak Akses Khusus Keuangan (Super Admin, Bendahara, Ketua/Wakil Himpunan)
  const canAccessKeuangan = isSuperAdmin || isBendahara || isKetuaOrWakil;

  // 2. Hak Akses Khusus Surat (Super Admin, Sekretaris, Ketua/Wakil Himpunan)
  const canAccessSurat = isSuperAdmin || isSekretaris || isKetuaOrWakil;

  // 3. Hak Akses Setara untuk Semua Ketua Bidang & Anggota Bidang (termasuk BPH)
  const canAccessKader = isAllPengurus;
  const canAccessRapat = isAllPengurus;
  const canAccessDivisi = isAllPengurus;
  const canAccessArtikel = isAllPengurus;
  const canAccessAkademik = true; // Terbuka untuk seluruh civitas mahasiswa & pengurus

  const groups = [];
  
  // Group Organisasi (Global)
  const groupOrganisasi = { title: "Profil & Organisasi", links: [] as any[] };
  groupOrganisasi.links.push({ href: "/admin/adart", label: "AD/ART & Konstitusi" });
  groupOrganisasi.links.push({ href: "/updates", label: "Catatan Rilis (v2.5)" });
  groupOrganisasi.links.push({ href: "/privacy", label: "Kebijakan Privasi" });
  groupOrganisasi.links.push({ href: "/terms", label: "Ketentuan Layanan" });
  groups.push(groupOrganisasi);

  // Group Utama
  const groupUtama = { title: "Manajemen Utama", links: [] as any[] };
  if (canAccessKader) groupUtama.links.push({ href: "/admin/kader", label: "Data Kader" });
  if (canAccessKeuangan) groupUtama.links.push({ href: "/admin/keuangan", label: "Keuangan" });
  if (canAccessSurat) groupUtama.links.push({ href: "/admin/surat", label: "Surat" });
  if (canAccessRapat) {
    groupUtama.links.push({ href: "/admin/rapat", label: "Rapat & Notulensi" });
    groupUtama.links.push({ href: "/absen", label: "Presensi & Biometrik" });
    groupUtama.links.push({ href: "/admin/scanner", label: "Scanner KTA Panitia" });
  }
  if (groupUtama.links.length > 0) groups.push(groupUtama);

  // Group Akademik
  const groupAkademik = { title: "Akademik & Publikasi", links: [] as any[] };
  if (canAccessArtikel) groupAkademik.links.push({ href: "/admin/artikel", label: "Artikel Web" });
  if (canAccessAkademik) {
    groupAkademik.links.push({ href: "/admin/challenge", label: "Arena Koding (LeetCode)" });
    groupAkademik.links.push({ href: "/admin/modul", label: "Bank Modul" });
    groupAkademik.links.push({ href: "/admin/mcp-hub", label: "MCP & Prompt Hub" });
    groupAkademik.links.push({ href: "/admin/devtools", label: "DevTools" });
    groupAkademik.links.push({ href: "/admin/karya", label: "Katalog Karya" });
    groupAkademik.links.push({ href: "/admin/lomba", label: "Info Lomba" });
  }
  if (groupAkademik.links.length > 0) groups.push(groupAkademik);

  // Group Divisi
  const groupDivisi = { title: "Kepanitiaan & Divisi", links: [] as any[] };
  if (canAccessDivisi) {
    groupDivisi.links.push({ href: "/admin/survey", label: "Survey & Riset" });
    groupDivisi.links.push({ href: "/admin/klub", label: "Klub IT" });
    groupDivisi.links.push({ href: "/admin/merchandise", label: "Merchandise / Danus" });
  }
  if (groupDivisi.links.length > 0) groups.push(groupDivisi);

  // Group Keamanan & Tata Kelola Enterprise (Super Admin)
  if (isSuperAdmin) {
    const groupSecurity = { title: "Keamanan & Audit", links: [] as any[] };
    groupSecurity.links.push({ href: "/admin/roles", label: "Hak Akses (RBAC)" });
    groupSecurity.links.push({ href: "/admin/audit-logs", label: "Audit Logs" });
    groups.push(groupSecurity);
  }


  return (
    <div className="min-h-screen bg-[#f8fafc]  selection:bg-gray-200 selection:text-gray-900">
      <TopNav dict={dict} 
        groups={groups} 
        userStr={session.user.name || "User"} 
        roleStr={isSuperAdmin ? "Super Admin" : userRoles[0] || "Pengurus"} 
        isImpersonating={!!(await cookies()).get("impersonated_user_id")}
      />

      <main className="max-w-7xl mx-auto py-5 sm:py-8 px-3.5 sm:px-6 lg:px-8">
        {children}
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
