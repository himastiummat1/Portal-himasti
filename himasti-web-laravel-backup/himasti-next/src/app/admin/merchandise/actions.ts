"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getMerchandises() {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");
  return await prisma.merchandise.findMany({
    orderBy: { created_at: "desc" }
  });
}

export async function addMerchandise(formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseInt(formData.get("price") as string) || 0;
  const stock = parseInt(formData.get("stock") as string) || 0;
  const category = formData.get("category") as string;
  const status = formData.get("status") as string;
  const gambar = formData.get("gambar") as string;

  if (!title || !category) throw new Error("Title and Category are required");

  await prisma.merchandise.create({
    data: {
      title,
      description: description || "",
      price,
      stock,
      category,
      status: status || "Tersedia",
      gambar: gambar || null
    }
  });

  revalidatePath("/admin/merchandise");
}

export async function updateMerchandise(id: number, formData: FormData) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = parseInt(formData.get("price") as string) || 0;
  const stock = parseInt(formData.get("stock") as string) || 0;
  const category = formData.get("category") as string;
  const status = formData.get("status") as string;
  const gambar = formData.get("gambar") as string;

  await prisma.merchandise.update({
    where: { id },
    data: {
      title,
      description,
      price,
      stock,
      category,
      status,
      gambar: gambar || null
    }
  });

  revalidatePath("/admin/merchandise");
}

export async function deleteMerchandise(id: number) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

  await prisma.merchandise.delete({
    where: { id }
  });

  revalidatePath("/admin/merchandise");
}
