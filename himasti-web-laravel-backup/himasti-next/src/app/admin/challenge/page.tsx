import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import ChallengeClient from "./ChallengeClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Arena Tantangan Koding & Sandbox • HIMASTI",
  description: "Asah kemampuan logika pemrograman dan algoritma dengan tantangan interaktif berstandar LeetCode di Portal HIMASTI."
};

export default async function ChallengePage() {
  const session = await auth();
  let userXp = 50;
  let solvedChallenges: string[] = [];

  if (session?.user?.id) {
    const userId = parseInt(session.user.id);
    const kader = await prisma.dataKader.findFirst({ where: { user_id: userId } });
    if (kader) {
      userXp = kader.xp ?? 50;
      if (kader.solved_challenges) {
        try {
          solvedChallenges = JSON.parse(kader.solved_challenges);
        } catch (e) {
          solvedChallenges = [];
        }
      }
    }
  }

  return <ChallengeClient initialXp={userXp} initialSolved={solvedChallenges} />;
}
