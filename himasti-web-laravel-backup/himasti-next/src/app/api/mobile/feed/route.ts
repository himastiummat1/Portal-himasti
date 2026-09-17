import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [modules, competitions, meetings] = await Promise.all([
      prisma.itModule.findMany({
        take: 10,
        orderBy: { created_at: "desc" },
      }),
      prisma.competitionInfo.findMany({
        take: 10,
        orderBy: { created_at: "desc" },
      }),
      prisma.meeting.findMany({
        take: 5,
        orderBy: { event_date: "desc" },
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          event_date: true,
          location: true,
          is_active: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        modules,
        competitions,
        meetings,
        totalModules: modules.length,
        totalCompetitions: competitions.length,
      },
    });
  } catch (error: any) {
    console.error("Mobile feed error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memuat feed: " + error.message },
      { status: 500 }
    );
  }
}
