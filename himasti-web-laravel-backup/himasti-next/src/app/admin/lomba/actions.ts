"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addLomba(formData: FormData) {
  const title = formData.get("title") as string;
  const organizer = formData.get("organizer") as string;
  const deadlineStr = formData.get("deadline") as string;
  const link = formData.get("link") as string;
  const type = formData.get("type") as string;
  const description = formData.get("description") as string;

  const deadline = deadlineStr ? new Date(deadlineStr) : null;

  try {
    await prisma.competitionInfo.create({
      data: {
        title, organizer, deadline, link, type, description
      }
    });
    revalidatePath("/admin/lomba");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteLomba(id: number) {
  await prisma.competitionInfo.delete({ where: { id } });
  revalidatePath("/admin/lomba");
}

export async function syncMockLomba() {
  const mockData = [
    { title: "Global AI Hackathon 2026", organizer: "Devpost & OpenAI", deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), link: "https://devpost.com", type: "Hackathon", description: "Kompetisi global membangun solusi AI inovatif." },
    { title: "AWS Cloud Practitioner Challenge", organizer: "Amazon Web Services", deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), link: "https://aws.amazon.com", type: "Sertifikasi", description: "Beasiswa dan challenge sertifikasi AWS gratis." },
    { title: "Google Solution Challenge", organizer: "Google Developer Student Clubs", deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 45), link: "https://developers.google.com", type: "Lomba IT", description: "Selesaikan satu dari 17 tujuan pembangunan berkelanjutan PBB." },
    { title: "NASA Space Apps Challenge", organizer: "NASA", deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), link: "https://spaceappschallenge.org/", type: "Hackathon", description: "Hackathon internasional menggunakan data terbuka NASA." },
    { title: "Cybersecurity Capture The Flag (CTF)", organizer: "HackTheBox", deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), link: "https://hackthebox.com", type: "Lomba IT", description: "Kompetisi keamanan siber tingkat universitas se-Asia Tenggara." },
  ];

  for (const item of mockData) {
    await prisma.competitionInfo.create({ data: item });
  }

  revalidatePath("/admin/lomba");
  return { success: true };
}
