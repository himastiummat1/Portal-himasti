"use server";
import { auth } from "@/auth";

async function requireAuth() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session;
}
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addLomba(formData: FormData) {
  await requireAuth();
  const title = formData.get("title") as string;
  const organizer = formData.get("organizer") as string;
  const deadlineStr = formData.get("deadline") as string;
  const link = formData.get("link") as string;
  const type = formData.get("type") as string;
  const description = formData.get("description") as string;

  const deadline = deadlineStr ? new Date(deadlineStr) : null;

  try {
    await prisma.competitionInfo.create({
      data: { title, organizer, deadline, link, type, description }
    });
    revalidatePath("/admin/lomba");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteLomba(id: number) {
  await requireAuth();
  await prisma.competitionInfo.delete({ where: { id } });
  revalidatePath("/admin/lomba");
}

export async function syncMockLomba() {
  await requireAuth();
  try {
    // We fetch real data from Devpost API
    const response = await fetch("https://devpost.com/api/hackathons?status=upcoming,open", { cache: "no-store" });
    if (!response.ok) throw new Error("Gagal mengambil data dari Devpost API");
    
    const data = await response.json();
    const hackathons = data.hackathons.slice(0, 5); // Take top 5

    for (const h of hackathons) {
      // Cek apakah lomba ini sudah ada di database (hindari duplikat)
      const existing = await prisma.competitionInfo.findFirst({
        where: { link: h.url }
      });
      
      if (!existing) {
        // Parse deadline from string like "Aug 04 - 31, 2026"
        let deadline = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // Default 7 days
        try {
          const dates = h.submission_period_dates.split("-");
          if (dates.length > 1) {
             const endDateStr = dates[1].trim(); 
             // Sangat kasar, hanya perkiraan
             deadline = new Date(endDateStr);
             if (isNaN(deadline.getTime())) {
                deadline = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
             }
          }
        } catch(e) {}

        await prisma.competitionInfo.create({
          data: {
            title: h.title,
            organizer: h.organization_name || "Devpost",
            deadline: deadline,
            link: h.url,
            type: "Hackathon",
            description: h.time_left_to_submission || "Hackathon Internasional"
          }
        });
      }
    }
    revalidatePath("/admin/lomba");
    return { success: true };
  } catch (err: any) {
    console.error("Scraping error:", err);
    return { success: false, error: err.message };
  }
}
