import LandingAnimation from "./LandingAnimation";
import { prisma } from "@/lib/prisma";

export const revalidate = 60; // Cache for 60 seconds

export default async function Home() {
  const competitions = await prisma.competitionInfo.findMany({
    orderBy: { deadline: "asc" },
    take: 10,
  });

  return <LandingAnimation competitions={competitions} />;
}
