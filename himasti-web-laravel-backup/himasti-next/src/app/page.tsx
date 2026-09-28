import LandingAnimation, { LandingStats } from "./LandingAnimation";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // Cache for 60 seconds

export default async function Home() {
  let competitions: any[] = [];
  let stats: LandingStats = {
    totalKader: 51,
    totalUsers: 57,
    totalLomba: 7,
    totalDivisi: 8,
  };

  try {
    const [comps, kadersCount, usersCount, lombaCount] = await Promise.all([
      prisma.competitionInfo.findMany({
        orderBy: { deadline: "asc" },
        take: 10,
      }),
      prisma.dataKader.count(),
      prisma.user.count(),
      prisma.competitionInfo.count(),
    ]);

    competitions = comps;
    stats = {
      totalKader: kadersCount || 51,
      totalUsers: usersCount || 57,
      totalLomba: lombaCount || 7,
      totalDivisi: 8,
    };
  } catch (err) {
    console.error("Failed to fetch home stats from database:", err);
  }

  return <LandingAnimation competitions={competitions} stats={stats} />;
}
