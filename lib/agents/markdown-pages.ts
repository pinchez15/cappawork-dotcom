import { getBlogPostBySlug } from "@/server/repos/blog"
import { SERVICES } from "@/app/services/data"
import { getSiteUrl } from "@/lib/site"

function tiptapToPlain(content: unknown): string {
  if (!content || typeof content !== "object") return ""
  const node = content as Record<string, unknown>
  if (node.type === "text" && typeof node.text === "string") return node.text
  if (Array.isArray(node.content)) {
    return node.content.map(tiptapToPlain).join("")
  }
  return ""
}

const STATIC_MARKDOWN: Record<string, () => string> = {
  "/": () => {
    const base = getSiteUrl()
    return [
      "# CappaWork",
      "",
      "CappaWork becomes your AI team. We find the profit lever, build the solution, coach you through the decisions, and train your team to own it.",
      "",
      "## Links",
      "",
      `- [Blog](${base}/blog)`,
      `- [Contact](${base}/contact)`,
      `- [Scorecard](${base}/scorecard)`,
      "",
      `Canonical HTML: ${base}/`,
      "",
    ].join("\n")
  },
  "/about": () => pageStub("/about", "About CappaWork"),
  "/blog": () => pageStub("/blog", "CappaWork blog index"),
  "/calculator": () => pageStub("/calculator", "Profit calculator"),
  "/cohort": () => pageStub("/cohort", "Cohort program"),
  "/cohort/success": () => pageStub("/cohort/success", "Cohort enrollment success"),
  "/contact": () => pageStub("/contact", "Contact CappaWork"),
  "/fulfillment-policy": () => pageStub("/fulfillment-policy", "Fulfillment policy"),
  "/linkedin-carousel": () => pageStub("/linkedin-carousel", "LinkedIn carousel"),
  "/privacy": () => pageStub("/privacy", "Privacy policy"),
  "/scorecard": () => pageStub("/scorecard", "Operational scorecard"),
  "/scorecard/thank-you": () => pageStub("/scorecard/thank-you", "Scorecard thank you"),
  "/terms": () => pageStub("/terms", "Terms of service"),
  "/transformation": () => pageStub("/transformation", "Transformation"),
}

function pageStub(path: string, title: string): string {
  const base = getSiteUrl()
  return [`# ${title}`, "", `Read the full page: ${base}${path}`, ""].join("\n")
}

export async function getMarkdownForPath(pathname: string): Promise<string | null> {
  const base = getSiteUrl()
  const staticFn = STATIC_MARKDOWN[pathname]
  if (staticFn) return staticFn()

  if (pathname.startsWith("/services/")) {
    const slug = pathname.slice("/services/".length)
    const svc = SERVICES.find((s) => s.slug === slug)
    if (!svc) return null
    return [
      `# ${svc.title}`,
      "",
      svc.subtitle,
      "",
      svc.cardDescription,
      "",
      `Full detail: ${base}/services/${slug}`,
      "",
    ].join("\n")
  }

  if (pathname.startsWith("/blog/")) {
    const slug = pathname.slice("/blog/".length)
    if (!slug) return null
    try {
      const post = await getBlogPostBySlug(slug, true)
      if (!post) return null
      const body = tiptapToPlain(post.content).trim()
      const excerpt = post.description?.trim() || ""
      return [
        `# ${post.title}`,
        "",
        excerpt,
        "",
        body || `_Full formatting: ${base}/blog/${slug}_`,
        "",
      ].join("\n")
    } catch {
      return [`# Blog`, "", `Read: ${base}/blog/${slug}`, ""].join("\n")
    }
  }

  return null
}
