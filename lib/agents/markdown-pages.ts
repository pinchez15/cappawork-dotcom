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
      "The embedded product team for healthcare and life sciences. We turn stuck initiatives into shipped products, so clinicians, coordinators, and care teams get their time back for patients.",
      "",
      "For healthcare and life sciences companies above about $30M in revenue: patient recruitment firms, agencies and medical communications, CROs and site networks, pharmacies, provider groups, and emerging biotech.",
      "",
      "## The belief",
      "",
      "AI is for speed, scale, and capability. It is never for truth, joy, or relationships. Groundwork: AI runs it. Teamwork: AI drafts and a qualified person decides. Lifework: never AI. AI never sits between a clinician and a patient.",
      "",
      "## Service lines",
      "",
      "- Embedded Product and AI Leadership",
      "- Services-to-Product Builds",
      "- Clinical Trial Operations",
      "- Regulated Content Operations",
      "- Pharmacy and Care Operations",
      "",
      "## How we work",
      "",
      "One-week sprints: Strategy, Product, UX, UI, Build. A full product is five or six sprints back to back. Sprints are $7,500 each (one focused week). Embedded team retainer: $20,000 a month for SVP-level product and AI leadership that also builds, with sprints added on top. Priced on what ships, not hours.",
      "",
      `Book a Strategy Sprint: ${base}/#discovery`,
      "",
      "## Links",
      "",
      `- Homepage: ${base}/`,
      `- About: ${base}/about`,
      `- Contact: ${base}/contact`,
      `- [Blog](${base}/blog)`,
      `- [Scorecard](${base}/scorecard)`,
      `- Sitemap: ${base}/sitemap.xml`,
      `- Agent summary: ${base}/llms.txt`,
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
