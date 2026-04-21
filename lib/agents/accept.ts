/**
 * RFC 7231-style Accept parsing for Markdown-for-agents negotiation.
 */
type ParsedAccept = { type: string; sub: string; q: number }

function parseAcceptHeader(header: string): ParsedAccept[] {
  return header.split(",").map((part) => {
    const [typePart, ...params] = part.trim().split(";").map((s) => s.trim())
    const [type, sub] = typePart.toLowerCase().split("/")
    let q = 1
    for (const p of params) {
      const [k, v] = p.split("=").map((s) => s.trim().toLowerCase())
      if (k === "q") q = Math.min(1, Math.max(0, parseFloat(v) || 0))
    }
    return { type, sub, q }
  })
}

/** True when the client prefers text/markdown at least as much as text/html. */
export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false
  const entries = parseAcceptHeader(accept)
  let bestHtml = 0
  let bestMd = 0
  for (const e of entries) {
    if (e.type === "text" && e.sub === "html") bestHtml = Math.max(bestHtml, e.q)
    if (e.type === "text" && (e.sub === "markdown" || e.sub === "x-markdown")) {
      bestMd = Math.max(bestMd, e.q)
    }
    if (e.type === "*" && e.sub === "*") {
      bestHtml = Math.max(bestHtml, e.q * 0.02)
      bestMd = Math.max(bestMd, e.q * 0.02)
    }
  }
  return bestMd > 0 && bestMd >= bestHtml
}

const MARKDOWN_STATIC = new Set([
  "/",
  "/about",
  "/blog",
  "/calculator",
  "/cohort",
  "/cohort/success",
  "/contact",
  "/fulfillment-policy",
  "/linkedin-carousel",
  "/privacy",
  "/scorecard",
  "/scorecard/thank-you",
  "/terms",
  "/transformation",
])

export function isMarkdownNegotiationPath(pathname: string): boolean {
  if (MARKDOWN_STATIC.has(pathname)) return true
  if (pathname.startsWith("/blog/") && pathname.length > "/blog/".length) return true
  if (pathname.startsWith("/services/") && pathname.length > "/services/".length) {
    return true
  }
  return false
}
