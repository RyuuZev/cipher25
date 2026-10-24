export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function instagramHandle(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(/instagram\.com\/([^/?#]+)/i);
  return match ? `@${match[1].replace(/\/$/, "")}` : null;
}

export function normalizeInstagramUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const handle = trimmed.replace(/^@/, "");
  if (!/^[a-zA-Z0-9._]+$/.test(handle)) {
    return null;
  }

  return `https://www.instagram.com/${handle}/`;
}

export function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
