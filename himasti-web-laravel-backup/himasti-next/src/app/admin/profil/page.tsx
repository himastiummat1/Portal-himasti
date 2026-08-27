import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfilClient from "./ProfilClient";

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = parseInt(session.user.id);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      data_kader: true,
      roles: { include: { role: true } }
    }
  });

  if (!user) redirect("/login");

  // Transform roles to a readable format
  const roleNames = user.roles.map(r => r.role.name.replace(/_/g, ' ').toUpperCase()).join(', ');

  const profileData = {
    id: user.id,
    name: user.name,
    email: user.email,
    nim: user.data_kader?.nim || "-",
    angkatan: user.data_kader?.angkatan || "-",
    no_hp: user.data_kader?.no_hp || "",
    jenis_kelamin: user.data_kader?.jenis_kelamin || "",
    status_kaderisasi: user.data_kader?.status_kaderisasi || "-",
    roles: roleNames || "KADER"
  };

  return <ProfilClient initialData={profileData} />;
}
