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
      "CappaWork helps businesses over ~$50 million in revenue implement AI and agents.",
      "",
      "Primary offer: 6-Week AI Transformation. One department, 2–4 workflows, production in six weeks. Week 0 Computer Work Audit ($2,500) is credited. Engagement investment is quoted after the audit. Billing process is 50% at signature / 50% at go-live. Client owns the IP. Narrow 12-month fix guarantee on shipped workflows (not a savings guarantee).",
      "",
      "How pricing works: Engagements are scoped from the audit — pricing depends on the workflow, risk, complexity, and solution. We discuss investment after discovery once the work is clear.",
      "",
      "Optional after go-live: Modernize retainer for unlimited fixes on shipped work plus one new workflow per month.",
      "",
      "Also offered: Discover (audit / roadmap) and Build (discrete product sprint for internal or external products). Internal workflow AI in one department is usually Transformation, not Build.",
      "",
      "## Links",
      "",
      `- Homepage: ${base}/`,
      `- Transformation: ${base}/transformation`,
      `- Discover: ${base}/discover`,
      `- Build: ${base}/build`,
      `- Modernize: ${base}/modernize`,
      `- Contact: ${base}/contact`,
      `- [Blog](${base}/blog)`,
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
  "/transformation": () => {
    const base = getSiteUrl()
    return [
      "# 6-Week AI Transformation",
      "",
      "For businesses over ~$50M revenue. One department, 2–4 workflows, production in six weeks. Investment scoped after the Computer Work Audit.",
      "",
      "Week 0: $2,500 Computer Work Audit (credited). Weeks 1–2 Discover with signed one-page scope. Weeks 3–5 Build with parallel run. Week 6 Adopt with client-owned IP.",
      "",
      "Billing process: 50% at signature, 50% at go-live. Narrow 12-month fix guarantee on shipped workflows — not a savings guarantee.",
      "",
      "How pricing works: Engagements are scoped from the audit — pricing depends on the workflow, risk, complexity, and solution.",
      "",
      `Full detail: ${base}/transformation`,
      "",
    ].join("\n")
  },
  "/discover": () => pageStub("/discover", "Discover"),
  "/build": () => pageStub("/build", "Build"),
  "/modernize": () => pageStub("/modernize", "Modernize retainer"),
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
