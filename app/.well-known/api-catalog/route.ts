import { NextResponse } from "next/server"
import { getSiteUrl } from "@/lib/site"

/**
 * RFC 9727 API catalog (RFC 9264 Linkset JSON profile).
 */
export async function GET() {
  const base = getSiteUrl()
  const body = {
    linkset: [
      {
        anchor: `${base}/api/`,
        "service-desc": [
          {
            href: `${base}/api/openapi.json`,
            type: "application/json",
          },
        ],
        "service-doc": [
          {
            href: `${base}/contact`,
            type: "text/html",
          },
        ],
        status: [
          {
            href: `${base}/api/health`,
            type: "application/json",
          },
        ],
      },
    ],
  }

  return NextResponse.json(body, {
    headers: {
      "Content-Type": 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
      "Cache-Control": "public, max-age=3600",
    },
  })
}
