import { NextResponse } from "next/server";
import { autoCloseExpiredMeetings } from "@/app/admin/rapat/telegram";

export const dynamic = "force-dynamic";

/**
 * Cron Job / Webhook Endpoint:
 * Menutup rapat yang telah melewati batas waktu secara otomatis dan mengirim rekap ke Telegram.
 * Dapat dipanggil secara periodik oleh Vercel Cron atau external scheduler.
 */
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Jika CRON_SECRET dikonfigurasi, validasi Authorization header
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await autoCloseExpiredMeetings();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      closedCount: result.closedCount,
      meetingIds: result.meetingIds
    });
  } catch (error: any) {
    console.error("Auto close rapat cron error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
