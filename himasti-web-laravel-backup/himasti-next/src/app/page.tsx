import LandingAnimation from "./LandingAnimation";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // Cache for 60 seconds

export default async function Home() {
  let competitions: any[] = [];
  try {
    competitions = await prisma.competitionInfo.findMany({
      orderBy: { deadline: "asc" },
      take: 10,
    });
  } catch (err) {
    console.error("Failed to fetch competitions:", err);
  }

  return <LandingAnimation competitions={competitions} />;
}
