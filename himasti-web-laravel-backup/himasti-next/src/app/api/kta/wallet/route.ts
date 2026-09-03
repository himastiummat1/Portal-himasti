import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { buildPkpassBuffer, generatePassJson } from "@/lib/walletPass";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const requestedNim = searchParams.get("nim");
    const format = searchParams.get("format") || "pkpass";

    let memberData = {
      name: "Kader HIMASTI",
      nim: "KADER-GUEST",
      angkatan: new Date().getFullYear().toString(),
      role: "Kader Aktif",
      title: "Kader Muda",
      email: ""
    };

    if (session?.user?.id) {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(session.user.id) },
        include: { data_kader: true }
      });

      if (user) {
        memberData.name = user.name;
        memberData.email = user.email;
        if (user.data_kader) {
          memberData.nim = user.data_kader.nim || memberData.nim;
          memberData.angkatan = user.data_kader.angkatan || memberData.angkatan;
          memberData.role = user.data_kader.status_kaderisasi || "Kader Aktif";
        }
      }
    } else if (requestedNim) {
      const kader = await prisma.dataKader.findUnique({
        where: { nim: requestedNim },
        include: { user: true }
      });
      if (kader) {
        memberData.name = kader.user?.name || "Kader HIMASTI";
        memberData.email = kader.user?.email || "";
        memberData.nim = kader.nim || memberData.nim;
        memberData.angkatan = kader.angkatan || memberData.angkatan;
        memberData.role = kader.status_kaderisasi || "Kader Aktif";
      }
    }

    if (format === "json") {
      const passJson = generatePassJson(memberData);
      return NextResponse.json(passJson);
    }

    // Generate .pkpass ZIP buffer
    const pkpassBuffer = buildPkpassBuffer(memberData);
    const sanitizedNim = memberData.nim.replace(/[^a-zA-Z0-9_-]/g, "");
    const filename = `HIMASTI-KTA-${sanitizedNim}.pkpass`;

    return new NextResponse(new Uint8Array(pkpassBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.apple.pkpass",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-cache, no-store, must-revalidate"
      }
    });
  } catch (error: any) {
    console.error("Error generating wallet pass:", error);
    return NextResponse.json({ error: "Failed to generate wallet pass", details: error?.message }, { status: 500 });
  }
}
