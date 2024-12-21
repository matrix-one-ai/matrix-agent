import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { hexStringToArrayBuffer } from "../../../helpers/crypto";

const algorithm = "aes-256-cbc";

const keyHex = process.env.NEXT_PUBLIC_VRM_KEY as string;
const ivHex = process.env.NEXT_PUBLIC_VRM_IV as string;

const keyArrayBuffer = hexStringToArrayBuffer(keyHex);
const ivArrayBuffer = hexStringToArrayBuffer(ivHex);

const key = Buffer.from(keyArrayBuffer);
const iv = Buffer.from(ivArrayBuffer);

function encryptVRM(inputPath: string, outputPath: string) {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const input = fs.createReadStream(inputPath);
  const output = fs.createWriteStream(outputPath);

  input.pipe(cipher).pipe(output);
}

export async function POST(req: NextRequest) {
  const { filePath } = await req.json();

  if (!filePath) {
    return NextResponse.json({ error: "File path is required" });
  }

  const inputPath = path.resolve(filePath);

  if (!fs.existsSync(inputPath)) {
    return NextResponse.json({ error: "File not found" });
  }

  const outputPath = path.resolve("encrypted.vrm");

  try {
    encryptVRM(inputPath, outputPath);
    return NextResponse.json({
      message: "File encrypted successfully",
      outputPath,
    });
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
