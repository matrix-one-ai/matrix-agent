import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get("file");

  if (!file) {
    return NextResponse.json({ error: "File name is required" });
  }

  const encryptedPath = path.resolve(`public/vrms/${file}-encrypted.vrm`);

  if (!fs.existsSync(encryptedPath)) {
    return NextResponse.json({ error: "Encrypted file not found" });
  }

  try {
    const encryptedData = fs.readFileSync(encryptedPath);

    return new NextResponse(encryptedData, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${file.replace(
          "-encrypted",
          ""
        )}"`,
        "Content-Length": String(encryptedData.length),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
