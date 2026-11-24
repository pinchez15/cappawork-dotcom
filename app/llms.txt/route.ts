import { NextResponse } from "next/server"
import { getSiteUrl } from "@/lib/site"

export const runtime = "nodejs"

export async function GET() {
  const base = getSiteUrl()
  const body = [
    "# CappaWork",
    "",
    "> The embedded product team for healthcare and life sciences. We design and build the AI workflows your licensed team should not still be doing by hand.",
    "",
    "## Who It Is For",
    "",
    "Healthcare and life sciences companies of about $50M revenue and up: pharma and biotech sponsors, payers, PBMs, health systems, digital health, CROs, and healthcare government contractors. The typical buyer is a VP or SVP of Strategy, Transformation, Digital, AI, or Innovation who owns a stuck, labor-heavy workflow and has budget. Smaller teams are welcome too, for example by starting with a single Build Sprint.",
    "",
    "## Philosophy",
    "",
    "AI is for speed, scale, and capability. It is never for truth, joy, or relationships. Every workflow is sorted into three kinds of work:",
    "",
    "- Groundwork: AI runs it. Rules-based work no licensed person should be doing by hand.",
    "- Teamwork: AI drafts and checks. A qualified person decides and signs.",
    "- Lifework: never AI. Consent, diagnosis, hard news, reportability decisions, and the relationships that make the care.",
    "",
    "AI never sits between a clinician and a patient. It clears the paperwork that keeps them apart.",
    "",
    "## Service Lines",
    "",
    "- AI strategy and roadmap: find where AI pays back first.",
    "- AI architecture: design how AI fits the systems you already run.",
    "- Healthcare agents: prior auth, eligibility, intake, trial start-up (feasibility, CDAs, budgets, contracts).",
    "- Trial safety operations: SAE intake, case narratives, EDC and safety database reconciliation, site query drafting. Sold to the sponsor; a qualified medical reviewer still decides reportability.",
    "- Custom software: sponsor-facing platforms, legacy SaaS replacement, portals with agents built in.",
    "",
    "## Engagement Model",
    "",
    "CappaWork works in one-week sprints. A sprint is a focused week with a defined output:",
    "",
    "- Strategy Sprint: the product vision, market and pricing, and the sprint plan. Where most clients start. $7,500.",
    "- Product Sprint: a working prototype of the core workflow.",
    "- UX Sprint: flows tested with the people who will use them.",
    "- UI Sprint: a production-ready interface and design system.",
    "- Build Sprint: working software shipped into the client environment, with every agent action logged. $15,000.",
    "",
    "A full product is five or six sprints back to back. HIPAA-ready build is included. Sprints can run on-site.",
    "",
    "Embedded team retainer: from $20,000 a month. SVP-level product and AI leadership that also builds. CappaWork does not sell hours; pricing is on what ships. Retainer clients add sprints on top.",
    "",
    "When a build touches PHI, CappaWork works under a BAA and inside the client environment. Agents run in the client cloud under the client identity. CappaWork will complete the client's security questionnaire and work under their MSA. SOC 2, 21 CFR Part 11, and GxP needs are documented against the client's environment; CappaWork does not claim certifications it does not hold. The client owns all code, IP, and scaffolding.",
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
