/**
 * Canonical site origin for sitemaps, robots, and well-known metadata.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (raw) {
    return raw.replace(/\/$/, "")
  }
  return "https://cappawork.com"
}
