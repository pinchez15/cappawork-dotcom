import { NextResponse } from "next/server"
import { getSiteUrl } from "@/lib/site"

export const runtime = "nodejs"

export async function GET() {
  const base = getSiteUrl()
  const body = [
    "# CappaWork",
    "",
    "> CappaWork changes how operational work gets done. Agents go in where the work calls for them.",
    "",
    "## What CappaWork Does",
    "",
    "CappaWork designs and deploys custom systems around the workflow a company already runs. The team keeps judgment, relationships, and the decisions a customer will feel. Software takes the copying, chasing, and handoffs. An agent is used when that is the right instrument, and left out when a person should decide.",
    "",
    "Deployments are custom. They are not a generalized tool, and they are not an 18-month program. The system stays on call after it is live. It is not a staffed seat.",
    "",
    "## Best Fit",
    "",
    "- A CEO or COO who wants an operation to move faster without a new layer of coordination",
    "- Teams whose best people are still the middleware between systems",
    "- Companies that want the change built on the tools they already run",
    "",
    "Company size is collected only on the discovery form.",
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
    "CappaWork designs, builds, and hosts the system. The client owns the IP. CappaWork maintains, secures, and supports it. Scope is set on a discovery call.",
    "",
    "## Cohorts & AI Training",
    "",
    "CappaWork also runs live cohorts for directors, VPs, and CXOs:",
    "",
    `- AI for Business Leaders — 3 sessions, ship one AI workflow: ${base}/ai-for-business-leaders`,
    `- AI Literacy Bootcamp — 4 sessions, strategic AI fluency: ${base}/ai-literacy-bootcamp`,
    `- Compare both cohorts: ${base}/cohorts`,
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
