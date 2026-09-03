import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import fs from "fs/promises";
import path from "path";
import AdArtClient from "./AdArtClient";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdArtPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  
  const isExecutive = Boolean(userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("ketua") || r.role.name.includes("keorganisasian")));

  let hasFile = false;
  let metadata = null;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "adart");

  try {
    const metaBuffer = await fs.readFile(path.join(uploadDir, "meta.json"), "utf8");
    metadata = JSON.parse(metaBuffer);
    await fs.access(path.join(uploadDir, `adart_official.${metadata.extension || "pdf"}`));
    hasFile = true;
  } catch (e) {
    // File or metadata doesn't exist
  }

  return <AdArtClient hasFile={hasFile} metadata={metadata} isExecutive={isExecutive} />;
}
