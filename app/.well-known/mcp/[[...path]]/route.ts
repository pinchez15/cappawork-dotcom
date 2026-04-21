import { NextResponse } from "next/server"
import { getSiteUrl } from "@/lib/site"

/**
 * MCP Server Card (SEP-1649 draft). This site is marketing-first; no remote MCP transport is offered.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ path?: string[] }> }
) {
  const { path } = await ctx.params
  if (path?.join("/") !== "server-card.json") {
    return new NextResponse("Not Found", { status: 404 })
  }

  const base = getSiteUrl()
  const card = {
    $schema: "https://modelcontextprotocol.io/schemas/server-card-2026-01.json",
    serverInfo: {
      name: "CappaWork Web",
      version: "1.0.0",
      description:
        "Public marketing and lead-capture site. MCP tools are not hosted here; use HTTP discovery under /.well-known/.",
    },
    transports: [] as { type: string; url: string }[],
    capabilities: {
      tools: false,
      resources: false,
    },
    links: {
      website: base,
      apiCatalog: `${base}/.well-known/api-catalog`,
    },
  }

  return NextResponse.json(card, {
    headers: {
      "Cache-Control": "public, max-age=86400",
    },
  })
}
