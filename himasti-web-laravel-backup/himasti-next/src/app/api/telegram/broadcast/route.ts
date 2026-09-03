import { NextResponse } from "next/server";
import { auth } from "@/auth";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const DEFAULT_GROUP_ID = process.env.TELEGRAM_CHAT_ID;

import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = parseInt(session.user.id);
  const userRoles = await prisma.modelHasRole.findMany({ where: { model_id: userId }, include: { role: true } });
  const canBroadcast = userRoles.some(r => 
    r.role.name === "super_admin" || 
    r.role.name.includes("humas") || 
    r.role.name.includes("metkom") || 
    r.role.name.includes("ketua") || 
    r.role.name.includes("sekretaris")
  );

  if (!canBroadcast) {
    return NextResponse.json({ error: "Akses ditolak: Hanya Humas, Sekretaris, atau Pengurus Inti yang dapat menyiarkan pesan Telegram." }, { status: 403 });
  }

  try {
    const { message, chatId = DEFAULT_GROUP_ID } = await req.json();

    if (!message || !chatId) {
      return NextResponse.json({ error: "Message and chatId are required" }, { status: 400 });
    }

    const payload = {
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    };

    const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!result.ok) {
      console.error("Telegram Broadcast Error:", result);
      return NextResponse.json({ error: "Gagal mengirim ke Telegram", details: result }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Broadcast Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
