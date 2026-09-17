import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const assetlinks = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "app.vercel.portal_himasti_beta.twa",
        sha256_cert_fingerprints: [
          "28:18:C3:06:5F:9A:11:9E:55:29:82:14:FC:70:64:9E:66:B1:7B:3E:22:10:C0:B1:C0:4C:CC:64:96:30:8E:B3",
        ],
      },
    },
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "id.ac.ummat.himasti",
        sha256_cert_fingerprints: [
          "28:18:C3:06:5F:9A:11:9E:55:29:82:14:FC:70:64:9E:66:B1:7B:3E:22:10:C0:B1:C0:4C:CC:64:96:30:8E:B3",
        ],
      },
    },
  ];

  return NextResponse.json(assetlinks, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400, must-revalidate",
    },
  });
}
