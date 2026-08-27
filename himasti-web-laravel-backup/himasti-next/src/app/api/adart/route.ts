import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "adart");
  
  try {
    const metaBuffer = await fs.readFile(path.join(uploadDir, "meta.json"), "utf8");
    const metadata = JSON.parse(metaBuffer);
    const ext = metadata.extension || "pdf";
    const filePath = path.join(uploadDir, `adart_official.${ext}`);
    
    const fileBuffer = await fs.readFile(filePath);
    
    const contentType = ext === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        ...(ext === "docx" ? { "Content-Disposition": "attachment; filename=AD-ART.docx" } : {}),
        "Cache-Control": "no-store, max-age=0"
      },
    });
  } catch (error) {
    return new NextResponse("File not found", { status: 404 });
  }
}
