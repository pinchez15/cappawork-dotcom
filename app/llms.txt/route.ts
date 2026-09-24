import { NextResponse } from "next/server"
import { getSiteUrl } from "@/lib/site"

export const runtime = "nodejs"

export async function GET() {
  const base = getSiteUrl()
  const body = [
    "# CappaWork",
    "",
    "> CappaWork helps businesses over ~$50 million in revenue implement AI and agents. Primary offer: 6-Week AI Transformation, starts at $90,000.",
    "",
    "## What CappaWork Does",
    "",
    "CappaWork removes Computer Work so teams can do more Human Work. The primary engagement drops an experienced operator into one department, ships 2–4 production workflows with AI agents in six weeks, and leaves client-owned IP plus a durable process.",
    "",
    "Positioning: best tools integrated into the client's systems — not a pile of seats and token spend that never hits the bottom line. Designed for ROI within about six months (directional; never a guaranteed-savings promise).",
    "",
    "## Best Fit",
    "",
    "- Businesses over ~$50M in annual revenue (operators, founders, executives who can fund a one-check engagement)",
    "- One department with clear workflow pain and willingness to baseline hours, cycle time, and error/rework",
    "- Teams constrained by manual work, software sprawl, and tools that cannot support their specific process",
    "",
    "## Primary Offer — 6-Week AI Transformation",
    "",
    "- Starts at $90,000 (floor; larger departments often ~$150,000)",
    "- Week 0: paid $2,500 Computer Work Audit, credited to the engagement. No baseline → no guarantee.",
    "- Weeks 1–2 Discover: signed one-page scope for 2–4 workflows before anything is built",
    "- Weeks 3–5 Build: production in their environment; parallel run from week 4",
    "- Week 6 Adopt: cutover, train, runbook, client-owned IP",
    "- Billing: 50% at signature, 50% at go-live (no net-30 on the back half)",
    "- Narrow 12-month guarantee: shipped workflows keep working as specified; model/API/vendor breaks fixed within two business days; not a savings guarantee; ~6 hours/month included fix capacity",
    `- Detail: ${base}/transformation`,
    "",
    "## Other Offers",
    "",
    `- Discover (audit / roadmap tiers from $2,500): ${base}/discover`,
    `- Build (bounded custom products from $35,000): ${base}/build`,
    `- Modernize retainer (~$10–12k/month after Transformation): unlimited fixes on shipped work + one new workflow/month — ${base}/modernize`,
    "",
    "## Cohorts & AI Training",
    "",
    "CappaWork runs paid live cohorts for directors, VPs, and CXOs who want to use AI well:",
    "",
    `- AI for Business Leaders — 3 sessions, ship one AI workflow: ${base}/ai-for-business-leaders`,
    `- AI Literacy Bootcamp — 4 sessions, strategic AI fluency: ${base}/ai-literacy-bootcamp`,
    `- Compare both cohorts: ${base}/cohorts`,
    "",
    "## Important URLs",
    "",
    `- Homepage: ${base}/`,
    `- Transformation: ${base}/transformation`,
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
