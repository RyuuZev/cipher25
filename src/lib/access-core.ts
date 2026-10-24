export const ACCESS_COOKIE = "cipher_access";
export const ACCESS_MAX_AGE = 60 * 60 * 24 * 7;

const DEV_FALLBACK_CODE = "ti25ulm";
const DEV_FALLBACK_SECRET = "cipher-ti25-arsip";
const isProduction = process.env.NODE_ENV === "production";

export function getAccessCode(): string {
  const configured = process.env.CIPHER_ACCESS_CODE?.trim();
  if (configured) return configured.toLowerCase();
  if (isProduction) {
    throw new Error("CIPHER_ACCESS_CODE belum diatur.");
  }
  return DEV_FALLBACK_CODE;
}

function getSecret(): string {
  const configured =
    process.env.CIPHER_ACCESS_SECRET?.trim() || process.env.CRON_SECRET?.trim();
  if (configured) return configured;
  if (isProduction) {
    throw new Error("CIPHER_ACCESS_SECRET belum diatur.");
  }
  return DEV_FALLBACK_SECRET;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function tokenFor(code: string): Promise<string> {
  const data = new TextEncoder().encode(`${code}:${getSecret()}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return toHex(digest);
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function accessToken(): Promise<string> {
  return tokenFor(getAccessCode());
}

export async function verifyCode(input: string): Promise<boolean> {
  const [candidate, expected] = await Promise.all([
    tokenFor(input.trim().toLowerCase()),
    accessToken(),
  ]);
  return safeEqual(candidate, expected);
}

export async function isValidToken(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  return safeEqual(value, await accessToken());
}

export function safeNext(raw: string | null | undefined, fallback = "/"): string {
  if (!raw) return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//")) return fallback;
  return raw;
}
