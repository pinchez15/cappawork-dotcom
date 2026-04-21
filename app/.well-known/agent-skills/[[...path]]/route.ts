import { createHash } from "crypto"
import { NextResponse } from "next/server"
import { getSiteUrl } from "@/lib/site"

function digestUrl(url: string): string {
  return createHash("sha256").update(url, "utf8").digest("hex")
}

/**
 * Agent Skills discovery index (draft). Digests are SHA-256 of the canonical skill URL string.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await ctx.params
  if (path?.join("/") !== "index.json") {
    return new NextResponse("Not Found", { status: 404 })
  }

  const base = getSiteUrl()
  const skills = [
    {
      name: "robots-txt",
      type: "text/markdown",
      description: "Guidance for robots.txt and crawl policy for agents.",
      url: "https://isitagentready.com/.well-known/agent-skills/robots-txt/SKILL.md",
      sha256: digestUrl(
        "https://isitagentready.com/.well-known/agent-skills/robots-txt/SKILL.md"
      ),
    },
    {
      name: "sitemap",
      type: "text/markdown",
      description: "Sitemap conventions for public URL discovery.",
      url: "https://isitagentready.com/.well-known/agent-skills/sitemap/SKILL.md",
      sha256: digestUrl(
        "https://isitagentready.com/.well-known/agent-skills/sitemap/SKILL.md"
      ),
    },
    {
      name: "site-contact",
      type: "text/html",
      description: "Human-facing contact and intake for CappaWork engagements.",
      url: `${base}/contact`,
      sha256: digestUrl(`${base}/contact`),
    },
  ]

  const body = {
    $schema: "https://agentskills.io/schemas/index-v0.2.json",
    name: "CappaWork agent skills index",
    skills,
  }

  return NextResponse.json(body, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  })
}
