"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { challengesData } from "./challengesData";

export async function submitSolvedChallenge(challengeId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = parseInt(session.user.id);
    const kader = await prisma.dataKader.findFirst({ where: { user_id: userId } });
    if (!kader) {
      return { success: false, error: "Data profil kader tidak ditemukan." };
    }

    const challenge = challengesData.find(c => c.id === challengeId);
    if (!challenge) {
      return { success: false, error: "Tantangan tidak valid." };
    }

    let solved: string[] = [];
    try {
      if (kader.solved_challenges) {
        solved = JSON.parse(kader.solved_challenges);
      }
    } catch (e) {
      solved = [];
    }

    let isNewSolve = false;
    let addedXp = 0;

    if (!solved.includes(challengeId)) {
      solved.push(challengeId);
      isNewSolve = true;
      addedXp = challenge.xp;
    }

    const currentXp = kader.xp || 50;
    const newXp = currentXp + addedXp;

    await prisma.dataKader.update({
      where: { id: kader.id },
      data: {
        solved_challenges: JSON.stringify(solved),
        xp: newXp
      }
    });

    revalidatePath("/admin/profil");
    revalidatePath("/admin/challenge");
    revalidatePath("/admin");
    revalidatePath("/admin/kader");

    return {
      success: true,
      isNewSolve,
      addedXp,
      totalXp: newXp,
      solvedChallenges: solved
    };
  } catch (error: any) {
    console.error("Submit solved challenge error:", error);
    return { success: false, error: "Gagal menyimpan progres ke database." };
  }
}
