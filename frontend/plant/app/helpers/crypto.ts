import crypto from "crypto";

export function hexStringToArrayBuffer(hexString: string): ArrayBuffer {
  const bytes = new Uint8Array(
    hexString.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
  return bytes.buffer;
}

export function truncateAddress(address: string): string {
  if (!address || address.length < 10) {
    return address;
  }
  return `${address.slice(0, 5)}..${address.slice(-5)}`;
}

export function generateHash(title: string): string {
  return crypto.createHash("sha256").update(title).digest("hex").slice(0, 4);
}
