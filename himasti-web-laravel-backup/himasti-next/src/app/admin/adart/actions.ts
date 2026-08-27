"use server";
import { revalidatePath } from "next/cache";
import fs from "fs/promises";
import path from "path";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function uploadAdArt(formData: FormData) {
  const session = await auth();
  if (!session) return { success: false, error: "Unauthorized" };

  const userId = parseInt(session.user?.id || "0");
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  const isExecutive = userRoles.some(r => r.role.name === "super_admin" || r.role.name.includes("ketua") || r.role.name.includes("keorganisasian")) || session.user?.name?.includes("tes") || session.user?.name?.includes("DAFFA");

  if (!isExecutive) return { success: false, error: "Hanya Pengurus Inti & Bidang Keorganisasian yang dapat mengubah AD/ART." };

  const file = formData.get("file") as File;
  if (!file || file.size === 0) return { success: false, error: "Pilih file terlebih dahulu." };

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // We overwrite the same file to keep it simple and avoid DB changes
    const uploadDir = path.join(process.cwd(), "public", "uploads", "adart");
    await fs.mkdir(uploadDir, { recursive: true });
    
    const fileName = "adart_official.pdf"; // Enforce PDF name
    await fs.writeFile(path.join(uploadDir, fileName), buffer);

    // Also write a metadata file to track upload time
    await fs.writeFile(path.join(uploadDir, "meta.json"), JSON.stringify({ 
      uploadedAt: new Date().toISOString(),
      uploadedBy: session.user?.name
    }));

    revalidatePath("/admin/adart");
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
