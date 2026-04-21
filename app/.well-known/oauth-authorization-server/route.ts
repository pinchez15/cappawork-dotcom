import { NextResponse } from "next/server"

export const revalidate = 3600

/**
 * OAuth 2.0 Authorization Server Metadata (RFC 8414).
 * Proxies from the same issuer as OpenID configuration when available.
 */
export async function GET() {
  const issuer = process.env.OPENID_ISSUER?.replace(/\/$/, "")
  if (!issuer) {
    return NextResponse.json(
      {
        error: "not_configured",
        message:
          "Set OPENID_ISSUER to your authorization server issuer to enable RFC 8414 discovery.",
      },
      { status: 503 }
    )
  }

  const asUrl = `${issuer}/.well-known/oauth-authorization-server`
  let upstream = await fetch(asUrl, { next: { revalidate: 3600 } })

  if (!upstream.ok) {
    upstream = await fetch(`${issuer}/.well-known/openid-configuration`, {
      next: { revalidate: 3600 },
    })
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: "upstream_discovery_failed", status: upstream.status },
      { status: 502 }
    )
  }

  const json = await upstream.json()
  return NextResponse.json(json, {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  })
}
