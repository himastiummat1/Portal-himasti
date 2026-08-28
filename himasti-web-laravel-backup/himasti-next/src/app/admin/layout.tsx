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
  }

  const isSuperAdmin = userRoles.includes('super_admin');
  
  const canAccessKader = isSuperAdmin || userRoles.some(r => r.includes('kaderisasi') || r.includes('pengkaderan'));
  const canAccessKeuangan = isSuperAdmin || userRoles.includes('bendahara') || userRoles.includes('bendahara_umum');
  const canAccessSurat = isSuperAdmin || userRoles.includes('sekretaris_umum');
  const canAccessArtikel = isSuperAdmin || userRoles.some(r => r.includes('metkom') || r.includes('humas'));
  const canAccessRapat = isSuperAdmin || userRoles.some(r => r.includes('ketua') || r.includes('sekretaris') || r.includes('bendahara') || r.includes('kabid'));
  const canAccessAkademik = true; // Everyone can access these
  const canAccessDivisi = isSuperAdmin || userRoles.some(r => r.includes('kabid') || r.includes('wakil'));

  const groups = [];
  
  // Group Organisasi (Global)
  const groupOrganisasi = { title: "Profil & Organisasi", links: [] as any[] };
  groupOrganisasi.links.push({ href: "/admin/adart", label: "AD/ART & Konstitusi" });
  groups.push(groupOrganisasi);

  // Group Utama
  const groupUtama = { title: "Manajemen Utama", links: [] as any[] };
  if (canAccessKader) groupUtama.links.push({ href: "/admin/kader", label: "Data Kader" });
  if (canAccessKeuangan) groupUtama.links.push({ href: "/admin/keuangan", label: "Keuangan" });
  if (canAccessSurat) groupUtama.links.push({ href: "/admin/surat", label: "Surat" });
  if (canAccessRapat) groupUtama.links.push({ href: "/admin/rapat", label: "Rapat & Notulensi" });
  if (groupUtama.links.length > 0) groups.push(groupUtama);

  // Group Akademik
  const groupAkademik = { title: "Akademik & Publikasi", links: [] as any[] };
  if (canAccessArtikel) groupAkademik.links.push({ href: "/admin/artikel", label: "Artikel Web" });
  if (canAccessAkademik) {
    groupAkademik.links.push({ href: "/admin/modul", label: "Bank Modul" });
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


  return (
    <div className="min-h-screen bg-[#f8fafc]  selection:bg-gray-200 selection:text-gray-900">
      <TopNav dict={dict} 
        groups={groups} 
        userStr={session.user.name || "User"} 
        roleStr={isSuperAdmin ? "Super Admin" : userRoles[0] || "Pengurus"} 
        isImpersonating={!!(await cookies()).get("impersonated_user_id")}
      />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
