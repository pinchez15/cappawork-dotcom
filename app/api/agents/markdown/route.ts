import { NextResponse, type NextRequest } from "next/server"
import { getMarkdownForPath } from "@/lib/agents/markdown-pages"
import { isMarkdownNegotiationPath } from "@/lib/agents/accept"

export const runtime = "nodejs"

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path") || "/"
  const normalized = path === "" ? "/" : path.startsWith("/") ? path : `/${path}`

  if (!isMarkdownNegotiationPath(normalized)) {
    return new NextResponse("Not Found", { status: 404 })
  }

  const body = await getMarkdownForPath(normalized)
  if (body === null) {
    return new NextResponse("Not Found", { status: 404 })
  }

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "Cache-Control": "private, no-cache",
    },
  })
}
