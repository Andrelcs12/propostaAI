import { BadRequestException } from "@nestjs/common";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata.google",
]);

function isPrivateIp(ip: string) {
  if (ip === "::1" || ip.startsWith("fe80:") || ip.startsWith("fc") || ip.startsWith("fd")) {
    return true;
  }

  if (!isIP(ip)) return false;

  if (ip.startsWith("10.") || ip.startsWith("127.") || ip.startsWith("192.168.")) {
    return true;
  }

  const parts = ip.split(".").map(Number);
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) {
    return true;
  }

  return false;
}

export async function assertPublicUrl(urlString: string) {
  let parsed: URL;

  try {
    parsed = new URL(urlString);
  } catch {
    throw new BadRequestException("URL invalida.");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new BadRequestException("Apenas URLs http ou https sao permitidas.");
  }

  const hostname = parsed.hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith(".local")) {
    throw new BadRequestException("URL nao permitida.");
  }

  if (isIP(hostname) && isPrivateIp(hostname)) {
    throw new BadRequestException("URL nao permitida.");
  }

  if (!isIP(hostname)) {
    const records = await lookup(hostname, { all: true });
    if (records.some((record) => isPrivateIp(record.address))) {
      throw new BadRequestException("URL nao permitida.");
    }
  }
}

export function normalizeOptionalUrl(value?: string | null) {
  if (!value?.trim()) return null;
  return value.trim();
}
