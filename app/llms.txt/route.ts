import { NextResponse } from "next/server"
import { getSiteUrl } from "@/lib/site"

export const runtime = "nodejs"

export async function GET() {
  const base = getSiteUrl()
  const body = [
    "# CappaWork",
    "",
    "> The embedded product team for healthcare and life sciences. We turn stuck initiatives into shipped products.",
    "",
    "## Who It Is For",
    "",
    "Healthcare and life sciences companies above about $30M in revenue: patient recruitment firms, healthcare agencies and medical communications, CROs and site networks, long-term care and specialty pharmacies, provider groups, and emerging biotech. The buyer is a CEO, President, or COO with a stalled initiative their internal team cannot move.",
    "",
    "## Philosophy",
    "",
    "AI is for speed, scale, and capability. It is never for truth, joy, or relationships. Every workflow is sorted into three kinds of work:",
    "",
    "- Groundwork: AI runs it. Rules-based work no licensed person should be doing by hand.",
    "- Teamwork: AI drafts and checks. A qualified person decides and signs.",
    "- Lifework: never AI. Consent, diagnosis, hard news, and the relationships that make the care.",
    "",
    "AI never sits between a clinician and a patient. It clears the paperwork that keeps them apart.",
    "",
    "## Service Lines",
    "",
    "- Embedded Product and AI Leadership: product vision, suite strategy, pricing, and working prototypes in front of leadership.",
    "- Services-to-Product Builds: sponsor- and client-facing platforms, legacy SaaS replacement, client portals with agents built in.",
    "- Clinical Trial Operations: patient follow-up and pre-screening, feasibility packets, start-up tracking, enrollment forecasting.",
    "- Regulated Content Operations: pre-MLR checks against approved claims, claims libraries, Draft 0 documents, translation routing.",
    "- Pharmacy and Care Operations: admissions, intake, prior auth packets, refill and delivery coordination, staffing and capacity models.",
    "",
    "## Engagement Model",
    "",
    "CappaWork works in one-week sprints. A sprint is a focused week with a defined output:",
    "",
    "- Strategy Sprint: the product vision, market and pricing, and the sprint plan. Where most clients start.",
    "- Product Sprint: a working prototype of the core workflow.",
    "- UX Sprint: flows tested with the coordinators, pharmacists, and clinicians who will use them.",
    "- UI Sprint: a production-ready interface and design system.",
    "- Build Sprint: working software shipped into the client environment, with every agent action logged.",
    "",
    "A full product is five or six sprints back to back. Sprints are $7,500 each (one focused week, booked by the week). Sprints can run on-site.",
    "",
    "Embedded team retainer: $20,000 a month. SVP-level product and AI leadership that also builds, priced like an SVP of Product or AI salary. CappaWork does not sell hours; pricing is on what ships. Retainer clients add sprints on top.",
    "",
    "When a build touches PHI, CappaWork works under a BAA and inside the client environment. The client owns all code, IP, and scaffolding.",
    "",
    "Primary call to action: Book a Strategy Sprint.",
    "",
    "## Important URLs",
    "",
    `- Homepage: ${base}/`,
    `- Book a Strategy Sprint: ${base}/#discovery`,
    `- About: ${base}/about`,
    `- Contact: ${base}/contact`,
    `- Sitemap: ${base}/sitemap.xml`,
    `- Robots: ${base}/robots.txt`,
    `- API catalog: ${base}/.well-known/api-catalog`,
    `- Markdown summary endpoint: ${base}/api/agents/markdown?path=/`,
    "",
  ].join("\n")

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
