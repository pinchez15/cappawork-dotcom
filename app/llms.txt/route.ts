import { NextResponse } from "next/server"
import { getSiteUrl } from "@/lib/site"

export const runtime = "nodejs"

export async function GET() {
  const base = getSiteUrl()
  const body = [
    "# CappaWork",
    "",
    "> CappaWork designs, builds, hosts, secures, and maintains custom software for $5M-$50M American businesses.",
    "",
    "## What CappaWork Does",
    "",
    "CappaWork helps business leaders replace expensive software that almost works. Many $5M-$50M businesses spend $30K-$50K per year on tools that still require spreadsheets, manual handoffs, duplicate entry, and workflow-specific workarounds.",
    "",
    "CappaWork builds custom systems around the actual business process, then builds AI agents inside those systems so teams do less busywork and more of the human work the business is built on: judgment, customer service, relationship building, sales, and operational decision-making.",
    "",
    "## Best Fit",
    "",
    "- American service businesses with $5M-$50M in annual revenue",
    "- Business owners and operators who know which workflow is painful",
    "- Teams constrained by manual work, software sprawl, and tools that cannot support their specific process",
    "- Companies that want a custom system hosted, secured, maintained, and improved over time",
    "",
    "## Common Builds",
    "",
    "- Custom CRM and customer operations systems",
    "- Sales pipeline and business development systems",
    "- Workflow management and approval systems",
    "- Reporting dashboards and analytics platforms",
    "- Client portals and field team mobile apps",
    "- AI agents for research, drafting, routing, summarization, follow-up, and internal support",
    "",
    "## Engagement Model",
    "",
    "CappaWork designs, builds, and hosts the software. The client owns the IP. CappaWork maintains, secures, and supports it. The target is to replace two or three high-cost subscriptions, remove the busywork around them, and create at least 10x value over two years.",
    "",
    "## Important URLs",
    "",
    `- Homepage: ${base}/`,
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
