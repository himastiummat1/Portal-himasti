import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      version: "2.6.0",
      buildDate: "17 September 2026",
      buildHash: "a2ba59d",
      releaseNotes: "Integrasi Native Capacitor Android & Official Download Portal",
      packageId: "id.ac.ummat.himasti",
      status: "healthy",
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      },
    }
  );
}
