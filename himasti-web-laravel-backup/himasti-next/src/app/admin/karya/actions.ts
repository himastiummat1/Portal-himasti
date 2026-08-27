"use server";
import { revalidatePath } from "next/cache";

export async function uploadKarya(formData: FormData) {
  return { success: true };
}

export async function deleteKarya(id: number) {
  return { success: true };
}
