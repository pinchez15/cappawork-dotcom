import { getBlogPostBySlug } from "@/server/repos/blog"
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
      "The embedded product team for healthcare and life sciences. We design and build the AI workflows your licensed team should not still be doing by hand.",
      "",
      "For healthcare and life sciences companies of about $50M revenue and up: pharma and biotech sponsors, payers, PBMs, health systems, digital health, CROs, and healthcare government contractors. The typical buyer is a VP or SVP of Strategy, Transformation, Digital, AI, or Innovation who owns a stuck, labor-heavy workflow. Smaller teams are welcome too, for example by starting with a single Build Sprint.",
      "",
      "## The belief",
      "",
      "AI is for speed, scale, and capability. It is never for truth, joy, or relationships. Groundwork: AI runs it. Teamwork: AI drafts and a qualified person decides. Lifework: never AI. AI never sits between a clinician and a patient.",
      "",
      "## Service lines",
      "",
      "- AI strategy and roadmap",
      "- AI architecture",
      "- Healthcare agents (including trial start-up)",
      "- Trial safety operations (SAE intake, case narratives, EDC and safety database reconciliation, site queries)",
      "- Custom software",
      "",
      "## How we work",
      "",
      "One-week sprints: Strategy, Product, UX, UI, Build. A full product is five or six sprints back to back. A Strategy Sprint is $7,500 (one focused week); build sprints are $15,000 each, HIPAA-ready build included. Embedded team retainer: from $20,000 a month for SVP-level product and AI leadership that also builds, with sprints added on top. Priced on what ships, not hours.",
      "",
      `Book a Strategy Sprint: ${base}/#discovery`,
      "",
      "## Links",
      "",
      `- Homepage: ${base}/`,
      `- About: ${base}/about`,
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
  "/contact": () => pageStub("/contact", "Contact CappaWork"),
  "/fulfillment-policy": () => pageStub("/fulfillment-policy", "Fulfillment policy"),
  "/privacy": () => pageStub("/privacy", "Privacy policy"),
  "/terms": () => pageStub("/terms", "Terms of service"),
}

function pageStub(path: string, title: string): string {
  const base = getSiteUrl()
  return [`# ${title}`, "", `Read the full page: ${base}${path}`, ""].join("\n")
}

export async function getMarkdownForPath(pathname: string): Promise<string | null> {
  const base = getSiteUrl()
  const staticFn = STATIC_MARKDOWN[pathname]
  if (staticFn) return staticFn()

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
